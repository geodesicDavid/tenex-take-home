from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # OAuth Configuration
    google_oauth_client_id: str = "test_client_id"
    google_oauth_client_secret: str = "test_client_secret"
    google_oauth_redirect_uri: str = "http://localhost:8001/api/v1/auth/google/callback"
    
    # Google Cloud Configuration
    google_cloud_project_id: str = "test_project_id"
    google_cloud_credentials_path: str = "test_credentials_path"
    
    # Application Configuration
    app_name: str = "Tenex Take Home API"
    app_version: str = "0.1.0"
    debug: bool = False
    
    # Session Configuration
    session_secret_key: str = "test_secret_key"
    session_expire_hours: int = 24
    
    # OAuth Scopes
    oauth_scopes: List[str] = [
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid"
    ]
    
    class Config:
        env_file = ".env"


settings = Settings()