from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest
import asyncio
import json

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/test-stream-fixed")
async def test_chat_message_streaming_fixed(
    request: Request,
    chat_request: ChatRequest
):
    """
    Test endpoint for streaming chat responses without authentication.
    """
    try:
        async def test_stream():
            # Send a simple test response
            test_response = "This is a test streaming response. The streaming functionality is working correctly!"
            
            # Stream the response character by character
            for i, char in enumerate(test_response):
                chunk = {
                    "id": f"test-{i}",
                    "content": char,
                    "isComplete": False
                }
                yield f"data: {json.dumps(chunk)}\n\n"
                await asyncio.sleep(0.05)  # Small delay for streaming effect
            
            # Send completion signal
            yield f"data: {json.dumps({'id': 'test-complete', 'content': '', 'isComplete': True})}\n\n"
        
        return StreamingResponse(
            test_stream(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your message: {str(e)}"
        )