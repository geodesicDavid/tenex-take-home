from pydantic import BaseModel
from datetime import datetime


class User(BaseModel):
    id: str
    email: str
    name: str
    picture: str
    verified_email: bool = True
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()


class UserSession(BaseModel):
    user_id: str
    session_id: str
    access_token: str
    expires_at: datetime
    created_at: datetime = datetime.utcnow()
    is_active: bool = True


class GoogleTokens(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str = "Bearer"


class GoogleUserInfo(BaseModel):
    id: str
    email: str
    name: str
    picture: str
    verified_email: bool