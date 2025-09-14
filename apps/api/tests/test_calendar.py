import pytest
from datetime import datetime, timezone, timedelta
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import User, UserSession, GoogleUserInfo
from app.models.calendar import CalendarEvent
from app.core.auth import auth_service
from app.services.calendar_service import calendar_service
from app.services.secret_manager import secret_manager


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_user():
    return User(
        id="test_user_id",
        email="test@example.com",
        name="Test User",
        picture="https://example.com/avatar.jpg",
        verified_email=True
    )


@pytest.fixture
def mock_google_user_info():
    return GoogleUserInfo(
        id="test_user_id",
        email="test@example.com",
        name="Test User",
        picture="https://example.com/avatar.jpg",
        verified_email=True
    )


@pytest.fixture
def mock_session(mock_google_user_info):
    return UserSession(
        user_id="test_user_id",
        session_id="test_session_id",
        access_token="test_access_token",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        user_info=mock_google_user_info
    )


@pytest.fixture
def mock_google_events():
    return [
        {
            "id": "event1",
            "summary": "Test Event 1",
            "description": "Test Description 1",
            "start": {"dateTime": "2025-09-10T10:00:00Z"},
            "end": {"dateTime": "2025-09-10T11:00:00Z"},
            "created": "2025-09-09T10:00:00Z",
            "updated": "2025-09-09T10:00:00Z"
        },
        {
            "id": "event2",
            "summary": "Test Event 2",
            "start": {"date": "2025-09-11"},
            "end": {"date": "2025-09-11"},
            "created": "2025-09-09T10:00:00Z",
            "updated": "2025-09-09T10:00:00Z"
        }
    ]


class TestCalendarEndpoints:
    
    @patch('app.core.auth.get_current_user')
    def test_get_calendar_events_success(self, mock_get_current_user, client, mock_user, mock_google_events):
        """Test successful calendar events retrieval"""
        # Setup mocks
        mock_get_current_user.return_value = mock_user
        
        with patch.object(calendar_service, 'fetch_calendar_events', return_value=[
            CalendarEvent(
                id="event1",
                summary="Test Event 1",
                description="Test Description 1",
                start_time=datetime(2025, 9, 10, 10, 0, 0, tzinfo=timezone.utc),
                end_time=datetime(2025, 9, 10, 11, 0, 0, tzinfo=timezone.utc)
            )
        ]):
            # Create a session in the session_store
            from app.core.auth import session_store
            user_info = GoogleUserInfo(
                id="test_user_id",
                email="test@example.com",
                name="Test User",
                picture="https://example.com/avatar.jpg",
                verified_email=True
            )
            session = UserSession(
                user_id="test_user_id",
                session_id="test_session_id",
                access_token="valid_token",
                expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
                user_info=user_info
            )
            session_store["test_session_id"] = session
            
            # Set session cookie for authentication
            client.cookies.set("session_id", "test_session_id")
            
            response = client.get("/api/v1/calendar/events")
            
            assert response.status_code == 200
            data = response.json()
            assert data["events"][0]["id"] == "event1"
            assert data["events"][0]["summary"] == "Test Event 1"
            assert data["total_count"] == 1
            assert data["time_range"] == "Next 7 days"
            
            # Clean up
            del session_store["test_session_id"]
    
    @patch('app.core.auth.get_current_user')
    def test_get_calendar_events_with_custom_days(self, mock_get_current_user, client, mock_user):
        """Test calendar events retrieval with custom days parameter"""
        mock_get_current_user.return_value = mock_user
        
        with patch.object(calendar_service, 'fetch_calendar_events', return_value=[]):
            # Create a session in the session_store
            from app.core.auth import session_store
            user_info = GoogleUserInfo(
                id="test_user_id",
                email="test@example.com",
                name="Test User",
                picture="https://example.com/avatar.jpg",
                verified_email=True
            )
            session = UserSession(
                user_id="test_user_id",
                session_id="test_session_id",
                access_token="valid_token",
                expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
                user_info=user_info
            )
            session_store["test_session_id"] = session
            
            # Set session cookie for authentication
            client.cookies.set("session_id", "test_session_id")
            
            response = client.get("/api/v1/calendar/events?days_ahead=14")
            
            assert response.status_code == 200
            data = response.json()
            assert data["time_range"] == "Next 14 days"
            
            # Clean up
            del session_store["test_session_id"]
    
    @patch('app.core.auth.get_current_user')
    def test_get_calendar_events_invalid_days(self, mock_get_current_user, client, mock_user):
        """Test calendar events retrieval with invalid days parameter"""
        mock_get_current_user.return_value = mock_user
        
        # Create a session in the session_store
        from app.core.auth import session_store
        user_info = GoogleUserInfo(
            id="test_user_id",
            email="test@example.com",
            name="Test User",
            picture="https://example.com/avatar.jpg",
            verified_email=True
        )
        session = UserSession(
            user_id="test_user_id",
            session_id="test_session_id",
            access_token="valid_token",
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
            user_info=user_info
        )
        session_store["test_session_id"] = session
        
        # Set session cookie for authentication
        client.cookies.set("session_id", "test_session_id")
        
        response = client.get("/api/v1/calendar/events?days_ahead=0")
        assert response.status_code == 422
        
        response = client.get("/api/v1/calendar/events?days_ahead=31")
        assert response.status_code == 422
        
        # Clean up
        del session_store["test_session_id"]
    
    @patch('app.core.auth.get_current_user')
    def test_get_calendar_events_service_failure(self, mock_get_current_user, client, mock_user):
        """Test calendar events retrieval when service fails"""
        mock_get_current_user.return_value = mock_user
        
        with patch.object(calendar_service, 'fetch_calendar_events', return_value=None):
            # Create a session in the session_store
            from app.core.auth import session_store
            user_info = GoogleUserInfo(
                id="test_user_id",
                email="test@example.com",
                name="Test User",
                picture="https://example.com/avatar.jpg",
                verified_email=True
            )
            session = UserSession(
                user_id="test_user_id",
                session_id="test_session_id",
                access_token="valid_token",
                expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
                user_info=user_info
            )
            session_store["test_session_id"] = session
            
            # Set session cookie for authentication
            client.cookies.set("session_id", "test_session_id")
            
            response = client.get("/api/v1/calendar/events")
            
            assert response.status_code == 500
            assert "Failed to fetch calendar events" in response.json()["detail"]
            
            # Clean up
            del session_store["test_session_id"]
    
    @patch('app.core.auth.get_current_user')
    def test_get_calendar_event_detail_not_implemented(self, mock_get_current_user, client, mock_user):
        """Test that event detail endpoint returns 501"""
        mock_get_current_user.return_value = mock_user
        
        # Create a session in the session_store
        from app.core.auth import session_store
        user_info = GoogleUserInfo(
            id="test_user_id",
            email="test@example.com",
            name="Test User",
            picture="https://example.com/avatar.jpg",
            verified_email=True
        )
        session = UserSession(
            user_id="test_user_id",
            session_id="test_session_id",
            access_token="valid_token",
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
            user_info=user_info
        )
        session_store["test_session_id"] = session
        
        # Set session cookie for authentication
        client.cookies.set("session_id", "test_session_id")
        
        response = client.get("/api/v1/calendar/events/event1")
        
        assert response.status_code == 501
        assert "not implemented" in response.json()["detail"]
        
        # Clean up
        del session_store["test_session_id"]


class TestCalendarService:
    
    def test_refresh_access_token_success(self):
        """Test successful access token refresh"""
        with patch('requests.post') as mock_post:
            mock_post.return_value.status_code = 200
            mock_post.return_value.json.return_value = {
                "access_token": "new_access_token",
                "expires_in": 3600,
                "token_type": "Bearer"
            }
            
            with patch.object(secret_manager, 'get_refresh_token', return_value="test_refresh_token"):
                tokens = calendar_service.refresh_access_token("test_user_id")
                
                assert tokens is not None
                assert tokens.access_token == "new_access_token"
                assert tokens.refresh_token == "test_refresh_token"
    
    def test_refresh_access_token_no_refresh_token(self):
        """Test refresh access token when no refresh token exists"""
        with patch.object(secret_manager, 'get_refresh_token', return_value=None):
            tokens = calendar_service.refresh_access_token("test_user_id")
            
            assert tokens is None
    
    def test_get_user_access_token_valid_session(self):
        """Test getting access token from valid session"""
        user_info = GoogleUserInfo(
            id="test_user_id",
            email="test@example.com",
            name="Test User",
            picture="https://example.com/avatar.jpg",
            verified_email=True
        )
        
        session = UserSession(
            user_id="test_user_id",
            session_id="test_session_id",
            access_token="valid_token",
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
            user_info=user_info
        )
        
        # Import the session_store from auth module
        from app.core.auth import session_store
        session_store["test_session_id"] = session
        
        token = calendar_service.get_user_access_token("test_user_id")
        
        assert token == "valid_token"
        
        # Clean up
        del session_store["test_session_id"]
    
    def test_get_user_access_token_expired_session(self):
        """Test getting access token when session is expired"""
        user_info = GoogleUserInfo(
            id="test_user_id",
            email="test@example.com",
            name="Test User",
            picture="https://example.com/avatar.jpg",
            verified_email=True
        )
        
        session = UserSession(
            user_id="test_user_id",
            session_id="test_session_id",
            access_token="expired_token",
            expires_at=datetime.now(timezone.utc) - timedelta(hours=1),
            user_info=user_info
        )
        
        # Import the session_store from auth module
        from app.core.auth import session_store
        session_store["test_session_id"] = session
        
        with patch.object(calendar_service, 'refresh_access_token', return_value=None):
            token = calendar_service.get_user_access_token("test_user_id")
            
            assert token is None
        
        # Clean up
        del session_store["test_session_id"]
    
    def test_transform_google_event_datetime(self):
        """Test transforming Google Calendar event with datetime"""
        google_event = {
            "id": "test_event",
            "summary": "Test Event",
            "description": "Test Description",
            "start": {"dateTime": "2025-09-10T10:00:00Z"},
            "end": {"dateTime": "2025-09-10T11:00:00Z"}
        }
        
        event = calendar_service._transform_google_event(google_event)
        
        assert event is not None
        assert event.id == "test_event"
        assert event.summary == "Test Event"
        assert event.description == "Test Description"
        assert isinstance(event.start_time, datetime)
        assert isinstance(event.end_time, datetime)
    
    def test_transform_google_event_date(self):
        """Test transforming Google Calendar event with date only"""
        google_event = {
            "id": "test_event",
            "summary": "Test Event",
            "start": {"date": "2025-09-10"},
            "end": {"date": "2025-09-11"}
        }
        
        event = calendar_service._transform_google_event(google_event)
        
        assert event is not None
        assert event.id == "test_event"
        assert event.summary == "Test Event"
        assert isinstance(event.start_time, datetime)
        assert isinstance(event.end_time, datetime)
    
    def test_parse_datetime_datetime_string(self):
        """Test parsing datetime string"""
        time_data = {"dateTime": "2025-09-10T10:00:00Z"}
        result = calendar_service._parse_datetime(time_data)
        
        assert result is not None
        assert isinstance(result, datetime)
        assert result.year == 2025
        assert result.month == 9
        assert result.day == 10
        assert result.hour == 10
    
    def test_parse_datetime_date_string(self):
        """Test parsing date string"""
        time_data = {"date": "2025-09-10"}
        result = calendar_service._parse_datetime(time_data)
        
        assert result is not None
        assert isinstance(result, datetime)
        assert result.year == 2025
        assert result.month == 9
        assert result.day == 10
    
    def test_parse_datetime_invalid(self):
        """Test parsing invalid time data"""
        time_data = {"invalid": "data"}
        result = calendar_service._parse_datetime(time_data)
        
        assert result is None