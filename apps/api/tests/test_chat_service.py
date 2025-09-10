import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from app.models.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

@pytest.fixture
def chat_service():
    return ChatService()

@pytest.fixture
def mock_chat_request():
    return ChatRequest(
        message="Hello, world!",
        timestamp=datetime.utcnow()
    )

@pytest.mark.asyncio
async def test_process_message_returns_placeholder_response(chat_service, mock_chat_request):
    """Test that process_message returns a placeholder response."""
    response = await chat_service.process_message(mock_chat_request)
    
    assert isinstance(response, ChatResponse)
    assert response.response == "I hear you."
    assert isinstance(response.timestamp, datetime)

@pytest.mark.asyncio
async def test_process_message_handles_exceptions(chat_service, mock_chat_request):
    """Test that process_message handles exceptions gracefully."""
    # Mock the service to raise an exception
    async def failing_process(*args, **kwargs):
        raise Exception("Test error")
    
    chat_service.process_message = failing_process
    
    response = await chat_service.process_message(mock_chat_request)
    
    assert isinstance(response, ChatResponse)
    assert "having trouble processing your message" in response.response
    assert isinstance(response.timestamp, datetime)

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
    assert await chat_service.validate_message(None) == False

@pytest.mark.asyncio
async def test_validate_message_rejects_too_long_message(chat_service):
    """Test that validate_message rejects messages that are too long."""
    long_message = "A" * 10001
    assert await chat_service.validate_message(long_message) == False

@pytest.mark.asyncio
async def test_validate_message_accepts_maximum_length_message(chat_service):
    """Test that validate_message accepts messages at maximum length."""
    max_message = "A" * 10000
    assert await chat_service.validate_message(max_message) == True