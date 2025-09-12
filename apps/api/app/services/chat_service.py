from datetime import datetime
from typing import List, AsyncGenerator
from app.models.chat import ChatRequest, ChatResponse
from app.models.calendar import CalendarEvent
from app.models.user import User
from app.services.llm_service import LLMService
from app.services.calendar_service import calendar_service
from app.prompts.calendar_assistant import PromptBuilder
import logging

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        self.llm_service = LLMService()
        self.prompt_builder = PromptBuilder()
        self.calendar_cache = {}  # Simple cache for calendar data
        self.cache_ttl = 300  # 5 minutes
    
    async def process_message(
        self, 
        request: ChatRequest, 
        user: User
    ) -> ChatResponse:
        """
        Process a chat message and return a response.
        
        Integrates with LLM and calendar services to provide intelligent responses.
        """
        try:
            # Validate the message
            if not await self.validate_message(request.message):
                raise ValueError("Message cannot be empty or too long")
            
            # Get calendar context if requested
            calendar_events = []
            if request.include_calendar_context:
                calendar_events = await self._get_calendar_context(user.id)
            
            # Build prompt with calendar context
            prompt = self.prompt_builder.build_chat_prompt(
                user_message=request.message,
                calendar_events=calendar_events,
                conversation_history=request.conversation_history,
                current_time=datetime.now()
            )
            
            # Generate response from LLM (non-streaming)
            response_chunks = []
            async for chunk in self.llm_service.generate_response(
                prompt=prompt,
                temperature=0.7,
                stream=False
            ):
                response_chunks.append(chunk)
            
            response_text = "".join(response_chunks)
            
            return ChatResponse(
                response=response_text,
                timestamp=datetime.utcnow(),
                calendar_context_included=bool(calendar_events),
                event_count=len(calendar_events)
            )
            
        except Exception as e:
            logger.error(f"Error processing chat message: {str(e)}")
            return ChatResponse(
                response="I'm sorry, I'm having trouble processing your message right now.",
                timestamp=datetime.utcnow(),
                calendar_context_included=False,
                event_count=0
            )
    
    async def process_message_streaming_plain(
        self, 
        request: ChatRequest, 
        user: User
    ) -> AsyncGenerator[str, None]:
        """
        Process a chat message and return a streaming response with plain text chunks.
        
        This function yields plain text chunks for use with streaming utilities.
        Integrates with LLM and calendar services to provide intelligent responses.
        """
        try:
            # Validate the message
            if not await self.validate_message(request.message):
                yield "I'm sorry, but your message appears to be invalid."
                return
            
            # Get calendar context if requested
            calendar_events = []
            if request.include_calendar_context:
                calendar_events = await self._get_calendar_context(user.id)
            
            # Build prompt with calendar context
            prompt = self.prompt_builder.build_chat_prompt(
                user_message=request.message,
                calendar_events=calendar_events,
                conversation_history=request.conversation_history,
                current_time=datetime.now()
            )
            
            # Generate streaming response from LLM
            async for chunk in self.llm_service.generate_response(
                prompt=prompt,
                temperature=0.7,
                stream=True
            ):
                if chunk:
                    yield chunk
                
        except Exception as e:
            logger.error(f"Error processing streaming chat message: {str(e)}")
            yield "I'm sorry, I'm having trouble processing your message right now."

    async def process_message_streaming(
        self, 
        request: ChatRequest, 
        user: User
    ) -> AsyncGenerator[str, None]:
        """
        Process a chat message and return a streaming response.
        
        This function yields SSE formatted chunks for direct use with StreamingResponse.
        Integrates with LLM and calendar services to provide intelligent responses.
        """
        try:
            # Validate the message
            if not await self.validate_message(request.message):
                # Yield an error chunk in the correct format
                error_chunk = {
                    "id": "error",
                    "content": "I'm sorry, but your message appears to be invalid.",
                    "isComplete": True,
                    "error": "Invalid message"
                }
                import json
                yield f"data: {json.dumps(error_chunk)}\n\n"
                return
            
            # Get calendar context if requested
            calendar_events = []
            if request.include_calendar_context:
                calendar_events = await self._get_calendar_context(user.id)
            
            # Build prompt with calendar context
            prompt = self.prompt_builder.build_chat_prompt(
                user_message=request.message,
                calendar_events=calendar_events,
                conversation_history=request.conversation_history,
                current_time=datetime.now()
            )
            
            # Generate streaming response from LLM
            import json
            chunk_count = 0
            async for chunk in self.llm_service.generate_response(
                prompt=prompt,
                temperature=0.7,
                stream=True
            ):
                if chunk:
                    streaming_chunk = {
                        "id": f"chunk-{chunk_count}",
                        "content": chunk,
                        "isComplete": False
                    }
                    yield f"data: {json.dumps(streaming_chunk)}\n\n"
                    chunk_count += 1
            
            # Send completion signal
            completion_chunk = {
                "id": "complete",
                "content": "",
                "isComplete": True
            }
            yield f"data: {json.dumps(completion_chunk)}\n\n"
                
        except Exception as e:
            logger.error(f"Error processing streaming chat message: {str(e)}")
            import json
            error_chunk = {
                "id": "error",
                "content": "I'm sorry, I'm having trouble processing your message right now.",
                "isComplete": True,
                "error": str(e)
            }
            yield f"data: {json.dumps(error_chunk)}\n\n"
    
    async def _get_calendar_context(self, user_id: str) -> List[CalendarEvent]:
        """
        Get calendar events for the user, with caching.
        """
        cache_key = f"calendar_{user_id}"
        current_time = datetime.now().timestamp()
        
        # Check cache first
        if cache_key in self.calendar_cache:
            cached_data = self.calendar_cache[cache_key]
            if current_time - cached_data['timestamp'] < self.cache_ttl:
                return cached_data['events']
        
        # Fetch fresh calendar data
        events = await self._fetch_calendar_data(user_id)
        
        # Update cache
        self.calendar_cache[cache_key] = {
            'events': events,
            'timestamp': current_time
        }
        
        return events
    
    async def _fetch_calendar_data(self, user_id: str) -> List[CalendarEvent]:
        """
        Fetch calendar data for the user.
        """
        try:
            # Fetch events for the next 7 days
            events = calendar_service.fetch_calendar_events(user_id, days_ahead=7)
            if events is None:
                return []
            
            return events
        except Exception as e:
            logger.error(f"Error fetching calendar data for user {user_id}: {str(e)}")
            return []
    
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
    
    async def get_calendar_summary(
        self, 
        user_id: str, 
        summary_type: str = "daily",
        target_date: datetime = None
    ) -> str:
        """
        Get a calendar summary for the user.
        """
        try:
            # Get calendar events
            events = await self._get_calendar_context(user_id)
            
            # Build summary prompt
            prompt = self.prompt_builder.build_calendar_summary_prompt(
                events=events,
                summary_type=summary_type,
                target_date=target_date
            )
            
            # Generate summary
            response_chunks = []
            async for chunk in self.llm_service.generate_response(
                prompt=prompt,
                temperature=0.5,
                stream=False
            ):
                response_chunks.append(chunk)
            
            return "".join(response_chunks)
            
        except Exception as e:
            logger.error(f"Error generating calendar summary: {str(e)}")
            return "I'm sorry, I'm having trouble generating a calendar summary right now."

# Create a singleton instance
chat_service = ChatService()