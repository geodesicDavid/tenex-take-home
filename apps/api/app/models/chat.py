from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .calendar import CalendarEvent

class ChatRequest(BaseModel):
    message: str
    timestamp: datetime
    include_calendar_context: bool = True
    conversation_history: Optional[List['ChatMessage']] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    calendar_context_included: bool = False
    event_count: int = 0

class ChatMessage(BaseModel):
    id: str
    content: str
    role: str  # "user" | "assistant"
    timestamp: datetime

class ChatRequestWithContext(BaseModel):
    message: str
    timestamp: datetime
    calendar_context: Optional[List[CalendarEvent]] = None
    conversation_history: Optional[List[ChatMessage]] = None

class StreamingChatResponse(BaseModel):
    id: str
    timestamp: datetime
    calendar_context_included: bool = False
    event_count: int = 0