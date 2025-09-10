from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    timestamp: datetime

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime

class ChatMessage(BaseModel):
    id: str
    text: str
    sender: str  # "user" | "agent"
    timestamp: datetime