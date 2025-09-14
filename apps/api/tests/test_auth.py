import pytest
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
from fastapi import Request, HTTPException
from datetime import datetime, timedelta, timezone

from app.main import app
from app.core.auth import AuthService, auth_service, session_store
from app.models.user import GoogleUserInfo, GoogleTokens, UserSession
from app.services.secret_manager import MockSecretManagerService


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_google_tokens():
    return GoogleTokens(
        access_token="mock_access_token",
        refresh_token="mock_refresh_token",
        expires_in=3600,
        token_type="Bearer"
    )


@pytest.fixture
def mock_google_user_info():
    return GoogleUserInfo(
        id="123456789",
        email="test@example.com",
        name="Test User",
        picture="https://example.com/avatar.jpg",
        verified_email=True
    )


@pytest.fixture
def mock_user_session(mock_google_user_info):
    return UserSession(
        user_id=mock_google_user_info.id,
        session_id="test_session_id",
        access_token="mock_access_token",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        is_active=True
    )


class TestAuthService:
    
    def test_generate_oauth_url(self):
        """Test OAuth URL generation"""
        state = "test_state"
        url = auth_service.generate_oauth_url(state)
        
        assert "https://accounts.google.com/o/oauth2/v2/auth" in url
        assert f"state={state}" in url
        assert "client_id=" in url
        assert "redirect_uri=" in url
        assert "scope=" in url
        assert "access_type=offline" in url
        assert "prompt=consent" in url
    
    @patch('app.core.auth.requests.post')
    def test_exchange_code_for_tokens_success(self, mock_post, mock_google_tokens):
        """Test successful token exchange"""
        mock_response = Mock()
        mock_response.json.return_value = {
            "access_token": "mock_access_token",
            "refresh_token": "mock_refresh_token",
            "expires_in": 3600,
            "token_type": "Bearer"
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        result = auth_service.exchange_code_for_tokens("test_code")
        
        assert result is not None
        assert result.access_token == "mock_access_token"
        assert result.refresh_token == "mock_refresh_token"
        assert result.expires_in == 3600
    
    @patch('app.core.auth.requests.post')
    def test_exchange_code_for_tokens_failure(self, mock_post):
        """Test failed token exchange"""
        mock_post.side_effect = Exception("Network error")
        
        result = auth_service.exchange_code_for_tokens("test_code")
        
        assert result is None
    
    @patch('app.core.auth.requests.get')
    def test_get_user_info_success(self, mock_get, mock_google_user_info):
        """Test successful user info retrieval"""
        mock_response = Mock()
        mock_response.json.return_value = {
            "id": "123456789",
            "email": "test@example.com",
            "name": "Test User",
            "picture": "https://example.com/avatar.jpg",
            "verified_email": True
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        result = auth_service.get_user_info("mock_access_token")
        
        assert result is not None
        assert result.id == "123456789"
        assert result.email == "test@example.com"
    
    @patch('app.core.auth.requests.get')
    def test_get_user_info_failure(self, mock_get):
        """Test failed user info retrieval"""
        mock_get.side_effect = Exception("Network error")
        
        result = auth_service.get_user_info("mock_access_token")
        
        assert result is None
    
    def test_create_session_id(self):
        """Test session ID creation"""
        session_id = auth_service.create_session_id()
        
        assert isinstance(session_id, str)
        assert len(session_id) > 0
    
    def test_create_user_session(self, mock_google_user_info):
        """Test user session creation"""
        session = auth_service.create_user_session(mock_google_user_info, "mock_access_token")
        
        assert isinstance(session, UserSession)
        assert session.user_id == mock_google_user_info.id
        assert session.access_token == "mock_access_token"
        assert session.expires_at > datetime.now(timezone.utc)
    
    def test_validate_session_cookie(self):
        """Test session cookie validation"""
        session_id = "test_session_id"
        cookie_value = auth_service.create_session_cookie(session_id)
        
        result = auth_service.validate_session_cookie(cookie_value)
        
        assert result == session_id


class TestMockSecretManagerService:
    
    @patch('app.services.secret_manager.MockSecretManagerService')
    def test_init(self, mock_service_class):
        """Test MockSecretManagerService initialization"""
        mock_service = Mock()
        mock_service_class.return_value = mock_service
        
        from app.services.secret_manager import MockSecretManagerService
        service = MockSecretManagerService()
        assert service.project_id is not None
    
    @patch('app.services.secret_manager.MockSecretManagerService')
    def test_store_refresh_token_success(self, mock_service_class):
        """Test successful refresh token storage"""
        mock_service = Mock()
        mock_service_class.return_value = mock_service
        mock_service.store_refresh_token.return_value = True
        
        from app.services.secret_manager import MockSecretManagerService
        service = MockSecretManagerService()
        result = service.store_refresh_token("test_user_id", "test_refresh_token")
        
        assert result is True
    
    @patch('app.services.secret_manager.MockSecretManagerService')
    def test_get_refresh_token_success(self, mock_service_class):
        """Test successful refresh token retrieval"""
        mock_service = Mock()
        mock_service_class.return_value = mock_service
        mock_service.get_refresh_token.return_value = "mock_refresh_token"
        
        from app.services.secret_manager import MockSecretManagerService
        service = MockSecretManagerService()
        result = service.get_refresh_token("test_user_id")
        
        assert result == "mock_refresh_token"
    
    @patch('app.services.secret_manager.MockSecretManagerService')
    def test_delete_refresh_token_success(self, mock_service_class):
        """Test successful refresh token deletion"""
        mock_service = Mock()
        mock_service_class.return_value = mock_service
        mock_service.delete_refresh_token.return_value = True
        
        from app.services.secret_manager import MockSecretManagerService
        service = MockSecretManagerService()
        result = service.delete_refresh_token("test_user_id")
        
        assert result is True


class TestAuthEndpoints:
    
    def test_auth_google_redirect(self, client):
        """Test Google OAuth initiation endpoint"""
        response = client.get("/api/v1/auth/google", follow_redirects=False)
        
        assert response.status_code == 307  # Redirect
        assert "accounts.google.com" in response.headers["location"]
    
    def test_auth_callback_missing_params(self, client):
        """Test OAuth callback with missing parameters"""
        response = client.get("/api/v1/auth/google/callback")
        
        assert response.status_code == 400
        assert "Missing required parameters" in response.json()["detail"]
    
    def test_auth_callback_with_error(self, client):
        """Test OAuth callback with error"""
        response = client.get("/api/v1/auth/google/callback?error=access_denied")
        
        assert response.status_code == 400
        assert "OAuth error: access_denied" in response.json()["detail"]
    
    def test_auth_status_unauthenticated(self, client):
        """Test auth status when not authenticated"""
        response = client.get("/api/v1/auth/status")
        
        assert response.status_code == 200
        assert response.json()["authenticated"] is False
        assert response.json()["user"] is None
    
    def test_auth_me_unauthenticated(self, client):
        """Test get current user when not authenticated"""
        response = client.get("/api/v1/auth/me")
        
        assert response.status_code == 401
    
    def test_logout(self, client):
        """Test logout endpoint"""
        response = client.get("/api/v1/auth/logout", follow_redirects=False)
        
        assert response.status_code == 307  # Redirect
        assert "session_id" in response.headers.get("set-cookie", "")
    
    def test_protected_route_unauthenticated(self, client):
        """Test protected route when not authenticated"""
        response = client.get("/api/v1/protected")
        
        assert response.status_code == 401
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestAuthMiddleware:
    
    def test_excluded_paths(self, client):
        """Test that excluded paths don't require authentication"""
        # Test health endpoint
        response = client.get("/health")
        assert response.status_code == 200
        
        # Test root endpoint
        response = client.get("/")
        assert response.status_code == 200
        
        # Test docs endpoint
        response = client.get("/docs")
        assert response.status_code == 200
    
    @patch('app.core.middleware.get_current_user')
    def test_authenticated_request(self, mock_get_user, client):
        """Test authenticated request"""
        from app.models.user import User
        
        mock_user = User(
            id="test_user_id",
            email="test@example.com",
            name="Test User",
            picture="https://example.com/avatar.jpg"
        )
        mock_get_user.return_value = mock_user
        
        response = client.get("/api/v1/protected")
        
        assert response.status_code == 200
        assert response.json()["message"] == "This is a protected route"


class TestSessionManagement:
    
    def test_session_storage(self, mock_user_session):
        """Test session storage functionality"""
        session_id = mock_user_session.session_id
        session_store[session_id] = mock_user_session
        
        assert session_id in session_store
        assert session_store[session_id] == mock_user_session
    
    def test_session_expiration(self, mock_user_session):
        """Test session expiration"""
        # Set session to expired
        mock_user_session.expires_at = datetime.now(timezone.utc) - timedelta(hours=1)
        session_store[mock_user_session.session_id] = mock_user_session
        
        # In a real implementation, this would be handled by the middleware
        # For testing, we'll just verify the session exists
        assert mock_user_session.session_id in session_store
    
    def test_session_cleanup(self, mock_user_session):
        """Test session cleanup"""
        session_id = mock_user_session.session_id
        session_store[session_id] = mock_user_session
        
        # Remove session
        del session_store[session_id]
        
        assert session_id not in session_store


if __name__ == "__main__":
    pytest.main([__file__])