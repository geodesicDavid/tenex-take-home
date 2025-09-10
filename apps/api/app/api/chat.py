from fastapi import APIRouter, Request, HTTPException, Depends
from app.models.chat import ChatRequest, ChatResponse
from app.models.user import User
from app.services.chat_service import chat_service
from app.core.middleware import require_auth

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
    Currently returns placeholder responses - LLM integration will be added in Story 3.1.
    """
    try:
        # Validate the message
        if not await chat_service.validate_message(chat_request.message):
            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty or too long"
            )
        
        # Process the message and get a response
        response = await chat_service.process_message(chat_request)
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your message: {str(e)}"
        )