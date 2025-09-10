from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest, ChatResponse
from app.models.user import User
from app.services.chat_service import chat_service
from app.core.middleware import require_auth
from app.utils.streaming import streaming_utils

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def send_chat_message(
    request: Request,
    chat_request: ChatRequest,
    user: User = Depends(require_auth)
):
    """
    Send a chat message and receive a response.
    
    This endpoint processes user messages and returns responses from the AI agent.
    Integrates with Google Gemini LLM and calendar services.
    """
    try:
        # Process the message and get a response
        response = await chat_service.process_message(chat_request, user)
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your message: {str(e)}"
        )


@router.post("/stream")
async def send_chat_message_streaming(
    request: Request,
    chat_request: ChatRequest,
    user: User = Depends(require_auth)
):
    """
    Send a chat message and receive a streaming response.
    
    This endpoint processes user messages and returns streaming responses from the AI agent.
    Integrates with Google Gemini LLM and calendar services for real-time responses.
    """
    try:
        # Get calendar events to determine if context was included
        calendar_events = []
        if chat_request.include_calendar_context:
            calendar_events = await chat_service._get_calendar_context(user.id)
        
        # Create streaming response
        response_generator = chat_service.process_message_streaming(chat_request, user)
        
        return streaming_utils.create_streaming_response(
            response_generator=response_generator,
            calendar_context_included=bool(calendar_events),
            event_count=len(calendar_events)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your message: {str(e)}"
        )