import requests
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict
from app.models.calendar import CalendarEvent
from app.models.user import GoogleTokens
from app.core.auth import auth_service, session_store

logger = logging.getLogger(__name__)


class CalendarService:
    def __init__(self):
        self.base_url = "https://www.googleapis.com/calendar/v3"
    
    def refresh_access_token(self, user_id: str) -> Optional[GoogleTokens]:
        """Refresh access token using stored refresh token"""
        refresh_token = auth_service.get_refresh_token_securely(user_id)
        if not refresh_token:
            logger.error(f"No refresh token found for user {user_id}")
            return None
        
        token_url = "https://oauth2.googleapis.com/token"
        
        data = {
            "client_id": auth_service.client_id,
            "client_secret": auth_service.client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token"
        }
        
        try:
            response = requests.post(token_url, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            
            # Create new tokens object (refresh token might not be returned)
            new_tokens = GoogleTokens(
                access_token=token_data["access_token"],
                refresh_token=refresh_token,  # Keep existing refresh token
                expires_in=token_data["expires_in"],
                token_type=token_data.get("token_type", "Bearer")
            )
            
            logger.info(f"Successfully refreshed access token for user {user_id}")
            return new_tokens
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error refreshing access token: {e}")
            return None
    
    def get_user_access_token(self, user_id: str) -> Optional[str]:
        """Get valid access token for user, refreshing if necessary"""
        # Check if user has an active session
        session = None
        for session_id, session_data in session_store.items():
            if session_data.user_id == user_id:
                session = session_data
                break
        
        if not session:
            logger.error(f"No active session found for user {user_id}")
            return None
        
        # Check if access token is still valid (with 5 minute buffer)
        if session.expires_at > datetime.now(timezone.utc) + timedelta(minutes=5):
            return session.access_token
        
        # Token is expired, refresh it
        new_tokens = self.refresh_access_token(user_id)
        if not new_tokens:
            return None
        
        # Update session with new access token
        session.access_token = new_tokens.access_token
        session.expires_at = datetime.now(timezone.utc) + timedelta(seconds=new_tokens.expires_in)
        
        # Update the session in the store
        for session_id, session_data in session_store.items():
            if session_data.user_id == user_id:
                session_store[session_id] = session
                break
        
        return new_tokens.access_token
    
    def fetch_calendar_events(self, user_id: str, days_ahead: int = 7) -> Optional[List[CalendarEvent]]:
        """Fetch calendar events for the specified number of days ahead"""
        access_token = self.get_user_access_token(user_id)
        if not access_token:
            logger.error(f"Could not get access token for user {user_id}")
            return None
        
        # Calculate time range
        time_min = datetime.now(timezone.utc)
        time_max = time_min + timedelta(days=days_ahead)
        
        # Format for Google Calendar API
        time_min_str = time_min.isoformat()
        time_max_str = time_max.isoformat()
        
        url = f"{self.base_url}/calendars/primary/events"
        
        params = {
            "timeMin": time_min_str,
            "timeMax": time_max_str,
            "singleEvents": "true",
            "orderBy": "startTime",
            "maxResults": 50  # Limit results
        }
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json"
        }
        
        try:
            response = requests.get(url, params=params, headers=headers)
            response.raise_for_status()
            
            calendar_data = response.json()
            google_events = calendar_data.get("items", [])
            
            # Transform Google Calendar events to our format
            events = []
            for event in google_events:
                transformed_event = self._transform_google_event(event)
                if transformed_event:
                    events.append(transformed_event)
            
            logger.info(f"Successfully fetched {len(events)} events for user {user_id}")
            return events
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching calendar events: {e}")
            return None
    
    def _transform_google_event(self, google_event: Dict) -> Optional[CalendarEvent]:
        """Transform Google Calendar event to our CalendarEvent format"""
        try:
            # Parse start and end times
            start_data = google_event.get("start", {})
            end_data = google_event.get("end", {})
            
            # Handle both date and dateTime formats
            start_time = self._parse_datetime(start_data)
            end_time = self._parse_datetime(end_data)
            
            if not start_time or not end_time:
                logger.warning(f"Could not parse times for event {google_event.get('id')}")
                return None
            
            return CalendarEvent(
                id=google_event["id"],
                summary=google_event.get("summary", "Untitled Event"),
                start=start_time,
                end=end_time,
                description=google_event.get("description")
            )
            
        except Exception as e:
            logger.error(f"Error transforming event {google_event.get('id')}: {e}")
            return None
    
    def _parse_datetime(self, time_data: Dict) -> Optional[datetime]:
        """Parse datetime from Google Calendar API response"""
        if "dateTime" in time_data:
            # Full datetime with timezone
            return datetime.fromisoformat(time_data["dateTime"].replace('Z', '+00:00'))
        elif "date" in time_data:
            # Date only (all day event)
            date_str = time_data["date"]
            return datetime.fromisoformat(date_str)
        else:
            return None


# Global instance
calendar_service = CalendarService()