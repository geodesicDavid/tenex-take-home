from datetime import datetime
from typing import Optional
from app.models.chat import ChatRequest, ChatResponse

class ChatService:
    def __init__(self):
        pass
    
    async def process_message(self, request: ChatRequest) -> ChatResponse:
        """
        Process a chat message and return a response.
        
        For this story, returns a simple placeholder response.
        LLM integration will be added in Story 3.1.
        """
        try:
            # Placeholder response - will be replaced with LLM integration in Story 3.1
            response_text = "I hear you."
            
            return ChatResponse(
                response=response_text,
                timestamp=datetime.utcnow()
            )
            
        except Exception as e:
            # In case of any error, return a fallback response
            return ChatResponse(
                response="I'm sorry, I'm having trouble processing your message right now.",
                timestamp=datetime.utcnow()
            )
    
    async def validate_message(self, message: str) -> bool:
        """
        Validate that a message is not empty and contains reasonable content.
        """
        if not message or not message.strip():
            return False
        
        # Basic length validation
        if len(message.strip()) > 10000:  # 10k character limit
            return False
        
        return True

# Create a singleton instance
chat_service = ChatService()