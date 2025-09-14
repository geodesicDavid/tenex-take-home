import pytest
import os
from unittest.mock import patch

# Set test environment variables
os.environ.setdefault("GOOGLE_OAUTH_CLIENT_ID", "test_client_id")
os.environ.setdefault("GOOGLE_OAUTH_CLIENT_SECRET", "test_client_secret")
os.environ.setdefault("GOOGLE_CLOUD_PROJECT_ID", "test_project_id")
os.environ.setdefault("GOOGLE_CLOUD_CREDENTIALS_PATH", "test_credentials_path")
os.environ.setdefault("SESSION_SECRET_KEY", "test_secret_key")


@pytest.fixture
def mock_google_oauth():
    """Mock Google OAuth responses"""
    with patch('app.core.auth.requests.post') as mock_post, \
         patch('app.core.auth.requests.get') as mock_get:
        
        # Mock token exchange response
        mock_post.return_value.json.return_value = {
            "access_token": "test_access_token",
            "refresh_token": "test_refresh_token",
            "expires_in": 3600,
            "token_type": "Bearer"
        }
        mock_post.return_value.raise_for_status.return_value = None
        
        # Mock user info response
        mock_get.return_value.json.return_value = {
            "id": "test_user_id",
            "email": "test@example.com",
            "name": "Test User",
            "picture": "https://example.com/avatar.jpg",
            "verified_email": True
        }
        mock_get.return_value.raise_for_status.return_value = None
        
        yield mock_post, mock_get


@pytest.fixture
def mock_secret_manager():
    """Mock Secret Manager service"""
    with patch('app.services.secret_manager.MockSecretManagerService') as mock_client:
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance
        
        # Mock successful operations
        mock_client_instance.create_secret.return_value = None
        mock_client_instance.add_secret_version.return_value = None
        mock_client_instance.access_secret_version.return_value.payload.data.decode.return_value = "test_refresh_token"
        mock_client_instance.delete_secret.return_value = None
        
        yield mock_client_instance