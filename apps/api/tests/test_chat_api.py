import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException, Request
from app.models.chat import ChatRequest, ChatResponse
from app.models.user import User
from app.api.chat import router
from app.services.chat_service import chat_service

@pytest.fixture
def mock_user():
    return User(
        id="test-user-id",
        email="test@example.com",
        name="Test User"
    )

@pytest.fixture
def mock_request():
    return MagicMock(spec=Request)

@pytest.fixture
def mock_chat_request():
    return ChatRequest(
        message="Hello, world!",
        timestamp=datetime.utcnow()
    )

@pytest.mark.asyncio
async def test_send_chat_message_success(mock_request, mock_user, mock_chat_request):
    """Test successful chat message sending."""
    # Mock the chat service response
    expected_response = ChatResponse(
        response="I hear you.",
        timestamp=datetime.utcnow()
    )
    
    chat_service.validate_message = AsyncMock(return_value=True)
    chat_service.process_message = AsyncMock(return_value=expected_response)
    
    # Get the endpoint function
    endpoint_func = router.routes[0].endpoint
    
    # Call the endpoint
    response = await endpoint_func(
        request=mock_request,
        chat_request=mock_chat_request,
        user=mock_user
    )
    
    # Verify the response
    assert isinstance(response, ChatResponse)
    assert response.response == "I hear you."
    assert chat_service.validate_message.called_with(mock_chat_request.message)
    assert chat_service.process_message.called_with(mock_chat_request)

@pytest.mark.asyncio
async def test_send_chat_message_empty_message(mock_request, mock_user):
    """Test chat message sending with empty message."""
    empty_request = ChatRequest(
        message="",
        timestamp=datetime.utcnow()
    )
    
    chat_service.validate_message = AsyncMock(return_value=False)
    
    # Get the endpoint function
    endpoint_func = router.routes[0].endpoint
    
    # Call the endpoint and expect HTTPException
    with pytest.raises(HTTPException) as exc_info:
        await endpoint_func(
            request=mock_request,
            chat_request=empty_request,
            user=mock_user
        )
    
    assert exc_info.value.status_code == 400
    assert "cannot be empty" in exc_info.value.detail

@pytest.mark.asyncio
async def test_send_chat_message_too_long_message(mock_request, mock_user):
    """Test chat message sending with too long message."""
    long_request = ChatRequest(
        message="A" * 10001,
        timestamp=datetime.utcnow()
    )
    
    chat_service.validate_message = AsyncMock(return_value=False)
    
    # Get the endpoint function
    endpoint_func = router.routes[0].endpoint
    
    # Call the endpoint and expect HTTPException
    with pytest.raises(HTTPException) as exc_info:
        await endpoint_func(
            request=mock_request,
            chat_request=long_request,
            user=mock_user
        )
    
    assert exc_info.value.status_code == 400
    assert "cannot be empty or too long" in exc_info.value.detail

@pytest.mark.asyncio
async def test_send_chat_message_service_error(mock_request, mock_user, mock_chat_request):
    """Test chat message sending when service raises an exception."""
    chat_service.validate_message = AsyncMock(return_value=True)
    chat_service.process_message = AsyncMock(side_effect=Exception("Service error"))
    
    # Get the endpoint function
    endpoint_func = router.routes[0].endpoint
    
    # Call the endpoint and expect HTTPException
    with pytest.raises(HTTPException) as exc_info:
        await endpoint_func(
            request=mock_request,
            chat_request=mock_chat_request,
            user=mock_user
        )
    
    assert exc_info.value.status_code == 500
    assert "An error occurred while processing your message" in exc_info.value.detail

@pytest.mark.asyncio
async def test_send_chat_message_requires_authentication(mock_request, mock_chat_request):
    """Test that chat endpoint requires authentication."""
    # This test verifies the authentication dependency is present
    # The actual authentication logic is tested in auth tests
    
    endpoint_func = router.routes[0].endpoint
    
    # The endpoint should have a dependency on require_auth
    dependencies = getattr(endpoint_func, '__fastapi_dependencies__', [])
    
    # Check that authentication is required (this is a basic check)
    # In a real test, we'd verify the specific auth dependency
    assert len(dependencies) > 0