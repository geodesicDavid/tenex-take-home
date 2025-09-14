from fastapi import APIRouter, Request, HTTPException, Depends, Query
from app.models.calendar import CalendarEventResponse
from app.models.user import User
from app.services.calendar_service import calendar_service
from app.core.middleware import require_auth

router = APIRouter(prefix="/api/v1/calendar", tags=["calendar"])


@router.get("/events", response_model=CalendarEventResponse)
async def get_calendar_events(
    request: Request,
    user: User = Depends(require_auth),
    days_ahead: int = Query(default=7, ge=1, le=30, description="Number of days ahead to fetch events")
):
    """
    Get calendar events for the authenticated user.
    
    Fetches events from the user's primary Google Calendar for the specified number of days ahead.
    Requires an active user session and valid Google OAuth credentials.
    """
    try:
        events = calendar_service.fetch_calendar_events(user.id, days_ahead)
        
        if events is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch calendar events"
            )
        
        return CalendarEventResponse(
            events=events,
            total_count=len(events),
            time_range=f"Next {days_ahead} days"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching calendar events: {str(e)}"
        )


@router.get("/events/{event_id}")
async def get_calendar_event(
    event_id: str,
    request: Request,
    user: User = Depends(require_auth)
):
    """
    Get a specific calendar event by ID.
    
    Note: This endpoint is not implemented in the current version.
    """
    raise HTTPException(
        status_code=501,
        detail="Event detail endpoint not implemented"
    )