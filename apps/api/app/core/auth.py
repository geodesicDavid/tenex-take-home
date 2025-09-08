from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer
from typing import Optional, Dict
import requests
import secrets
from datetime import datetime, timedelta
from urllib.parse import urlencode

from app.core.config import settings
from app.models.user import User, GoogleTokens, GoogleUserInfo, UserSession
from app.services.secret_manager import secret_manager

security = HTTPBearer()


class AuthService:
    def __init__(self):
        self.client_id = settings.google_oauth_client_id
        self.client_secret = settings.google_oauth_client_secret
        self.redirect_uri = settings.google_oauth_redirect_uri
        self.scopes = settings.oauth_scopes
        self.session_secret = settings.session_secret_key
        self.session_expire_hours = settings.session_expire_hours
    
    def generate_oauth_url(self, state: str) -> str:
        """Generate Google OAuth URL"""
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": " ".join(self.scopes),
            "response_type": "code",
            "state": state,
            "access_type": "offline",
            "prompt": "consent"
        }
        
        return f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    
    def exchange_code_for_tokens(self, code: str) -> Optional[GoogleTokens]:
        """Exchange authorization code for access and refresh tokens"""
        token_url = "https://oauth2.googleapis.com/token"
        
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri
        }
        
        try:
            response = requests.post(token_url, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            
            return GoogleTokens(
                access_token=token_data["access_token"],
                refresh_token=token_data["refresh_token"],
                expires_in=token_data["expires_in"],
                token_type=token_data["token_type"]
            )
            
        except requests.RequestException as e:
            print(f"Error exchanging code for tokens: {e}")
            return None
    
    def get_user_info(self, access_token: str) -> Optional[GoogleUserInfo]:
        """Get user information from Google using access token"""
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        try:
            response = requests.get(user_info_url, headers=headers)
            response.raise_for_status()
            
            user_data = response.json()
            
            return GoogleUserInfo(
                id=user_data["id"],
                email=user_data["email"],
                name=user_data["name"],
                picture=user_data["picture"],
                verified_email=user_data["verified_email"]
            )
            
        except requests.RequestException as e:
            print(f"Error getting user info: {e}")
            return None
    
    def create_session_id(self) -> str:
        """Create a secure session ID"""
        return secrets.token_urlsafe(32)
    
    def create_session_cookie(self, session_id: str) -> str:
        """Create a session cookie value"""
        return session_id
    
    def validate_session_cookie(self, cookie_value: str) -> Optional[str]:
        """Validate session cookie and return session ID"""
        # In a real implementation, you'd want to validate the signature
        # and expiration. For now, just return the value.
        return cookie_value
    
    def store_refresh_token_securely(self, user_id: str, refresh_token: str) -> bool:
        """Store refresh token using secret manager"""
        return secret_manager.store_refresh_token(user_id, refresh_token)
    
    def get_refresh_token_securely(self, user_id: str) -> Optional[str]:
        """Retrieve refresh token using secret manager"""
        return secret_manager.get_refresh_token(user_id)
    
    def delete_refresh_token_securely(self, user_id: str) -> bool:
        """Delete refresh token using secret manager"""
        return secret_manager.delete_refresh_token(user_id)
    
    def create_user_session(self, user: GoogleUserInfo, access_token: str) -> UserSession:
        """Create a user session"""
        session_id = self.create_session_id()
        expires_at = datetime.utcnow() + timedelta(hours=self.session_expire_hours)
        
        return UserSession(
            user_id=user.id,
            session_id=session_id,
            access_token=access_token,
            expires_at=expires_at
        )


# Global instance
auth_service = AuthService()


# Session storage (in-memory for demo, use Redis in production)
session_store: Dict[str, UserSession] = {}


def get_current_user(request: Request) -> Optional[User]:
    """Get current user from session"""
    session_cookie = request.cookies.get("session_id")
    if not session_cookie:
        return None
    
    session_id = auth_service.validate_session_cookie(session_cookie)
    if not session_id:
        return None
    
    session = session_store.get(session_id)
    if not session:
        return None
    
    if session.expires_at < datetime.utcnow():
        del session_store[session_id]
        return None
    
    # For demo purposes, we'll create a minimal user object
    # In a real app, you'd fetch this from a database
    return User(
        id=session.user_id,
        email="user@example.com",  # This would come from the stored user data
        name="User Name",          # This would come from the stored user data
        picture="https://example.com/avatar.jpg"  # This would come from the stored user data
    )


async def get_current_active_user(request: Request) -> User:
    """Get current active user or raise exception"""
    user = get_current_user(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user