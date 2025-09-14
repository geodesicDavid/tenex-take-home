import pytest
from datetime import datetime
from unittest.mock import Mock, patch, AsyncMock
from fastapi import HTTPException
from app.models.chat import ChatRequest, ChatResponse, ChatMessage
from app.models.user import User
from app.models.calendar import CalendarEvent
from app.services.chat_service import ChatService


@pytest.fixture
def chat_service():
    return ChatService()


@pytest.fixture
def test_user():
    return User(id="test_user_id", email="test@example.com", name="Test User")


@pytest.fixture
def test_events():
    return [
        CalendarEvent(
            id="1",
            summary="Test Meeting",
            start_time=datetime(2023, 12, 1, 10, 0),
            end_time=datetime(2023, 12, 1, 11, 0),
            description="Test meeting description",
            location="Test Location"
        ),
        CalendarEvent(
            id="2",
            summary="Another Meeting",
            start_time=datetime(2023, 12, 1, 14, 0),
            end_time=datetime(2023, 12, 1, 15, 0)
        )
    ]


@pytest.fixture
def test_history():
    return [
        ChatMessage(
            id="1",
            content="Hello",
            role="user",
            timestamp=datetime(2023, 12, 1, 9, 0)
        ),
        ChatMessage(
            id="2",
            content="Hi there!",
            role="assistant",
            timestamp=datetime(2023, 12, 1, 9, 1)
        )
    ]


@pytest.mark.asyncio
async def test_process_message_with_calendar_context(chat_service, test_user, test_events, test_history):
    """Test message processing with calendar context."""
    with patch.object(chat_service, '_get_calendar_context', return_value=test_events) as mock_get_calendar, \
         patch.object(chat_service.llm_service, 'generate_response') as mock_generate:
        
        async def mock_async_generator():
            yield "Hello"
            yield " world!"
        mock_generate.return_value = mock_async_generator()
        
        request = ChatRequest(
            message="What meetings do I have today?",
            timestamp=datetime.now(),
            include_calendar_context=True,
            conversation_history=test_history
        )
        
        response = await chat_service.process_message(request, test_user)
        
        assert response.response == "Hello world!"
        assert response.calendar_context_included is True
        assert response.event_count == 2
        mock_get_calendar.assert_called_once_with(test_user.id)
        mock_generate.assert_called_once()


@pytest.mark.asyncio
async def test_process_message_without_calendar_context(chat_service, test_user):
    """Test message processing without calendar context."""
    with patch.object(chat_service.llm_service, 'generate_response') as mock_generate:
        async def mock_async_generator():
            yield "Hello"
            yield " world!"
        mock_generate.return_value = mock_async_generator()
        
        request = ChatRequest(
            message="Hello!",
            timestamp=datetime.now(),
            include_calendar_context=False,
            conversation_history=[]
        )
        
        response = await chat_service.process_message(request, test_user)
        
        assert response.response == "Hello world!"
        assert response.calendar_context_included is False
        assert response.event_count == 0


@pytest.mark.asyncio
async def test_process_message_streaming(chat_service, test_user, test_events, test_history):
    """Test streaming message processing."""
    with patch.object(chat_service, '_get_calendar_context', return_value=test_events), \
         patch.object(chat_service.llm_service, 'generate_response') as mock_generate:
        
        async def mock_stream():
            yield "Hello"
            yield " world!"
        
        mock_generate.return_value = mock_stream()
        
        request = ChatRequest(
            message="What meetings do I have today?",
            timestamp=datetime.now(),
            include_calendar_context=True,
            conversation_history=test_history
        )
        
        response_chunks = []
        async for chunk in chat_service.process_message_streaming(request, test_user):
            response_chunks.append(chunk)
        
        # Check that we got SSE-formatted chunks
        assert len(response_chunks) >= 2
        assert "data:" in response_chunks[0]
        assert "Hello" in response_chunks[0]
        assert "data:" in response_chunks[1]
        assert "world!" in response_chunks[1]


@pytest.mark.asyncio
async def test_get_calendar_context_cache_hit(chat_service, test_user, test_events):
    """Test calendar context caching."""
    cache_key = f"calendar_{test_user.id}"
    chat_service.calendar_cache[cache_key] = {
        'events': test_events,
        'timestamp': datetime.now().timestamp()
    }
    
    events = await chat_service._get_calendar_context(test_user.id)
    
    assert events == test_events


@pytest.mark.asyncio
async def test_get_calendar_context_cache_miss(chat_service, test_user, test_events):
    """Test calendar context cache miss."""
    with patch.object(chat_service, '_fetch_calendar_data', return_value=test_events) as mock_fetch:
        events = await chat_service._get_calendar_context(test_user.id)
        
        assert events == test_events
        mock_fetch.assert_called_once()
        
        cache_key = f"calendar_{test_user.id}"
        assert cache_key in chat_service.calendar_cache


@pytest.mark.asyncio
async def test_validate_message_accepts_valid_message(chat_service):
    """Test that validate_message accepts valid messages."""
    assert await chat_service.validate_message("Hello, world!") == True
    assert await chat_service.validate_message("A" * 100) == True
    assert await chat_service.validate_message("  spaced message  ") == True


@pytest.mark.asyncio
async def test_validate_message_rejects_empty_message(chat_service):
    """Test that validate_message rejects empty messages."""
    assert await chat_service.validate_message("") == False
    assert await chat_service.validate_message("   ") == False


@pytest.mark.asyncio
async def test_validate_message_rejects_too_long_message(chat_service):
    """Test that validate_message rejects messages that are too long."""
    long_message = "A" * 10001
    assert await chat_service.validate_message(long_message) == False


@pytest.mark.asyncio
async def test_get_calendar_summary(chat_service, test_user, test_events):
    """Test calendar summary generation."""
    with patch.object(chat_service, '_get_calendar_context', return_value=test_events), \
         patch.object(chat_service.llm_service, 'generate_response') as mock_generate:
        
        async def mock_async_generator():
            yield "You have 2 meetings today."
        mock_generate.return_value = mock_async_generator()
        
        summary = await chat_service.get_calendar_summary(
            user_id=test_user.id,
            summary_type="daily",
            target_date=datetime(2023, 12, 1)
        )
        
        assert summary == "You have 2 meetings today."
        mock_generate.assert_called_once()


@pytest.mark.asyncio
async def test_process_message_error_handling(chat_service, test_user):
    """Test error handling in message processing."""
    request = ChatRequest(
        message="",
        timestamp=datetime.now(),
        include_calendar_context=True,
        conversation_history=[]
    )
    
    response = await chat_service.process_message(request, test_user)
    
    assert "having trouble" in response.response