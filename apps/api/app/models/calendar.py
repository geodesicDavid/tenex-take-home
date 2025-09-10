from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class CalendarEvent(BaseModel):
    id: str
    summary: str
    start_time: datetime
    end_time: datetime
    description: Optional[str] = None
    location: Optional[str] = None
    attendees: Optional[List[dict]] = None


class CalendarEventResponse(BaseModel):
    events: List[CalendarEvent]
    total_count: int
    time_range: str


class GoogleCalendarEvent(BaseModel):
    id: str
    summary: str
    description: Optional[str] = None
    start: dict
    end: dict
    created: datetime
    updated: datetime


class GoogleCalendarResponse(BaseModel):
    items: List[GoogleCalendarEvent]
    next_page_token: Optional[str] = None
    next_sync_token: Optional[str] = None