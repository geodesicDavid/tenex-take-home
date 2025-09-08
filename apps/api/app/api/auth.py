from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import RedirectResponse
from typing import Optional
import secrets
import time

from app.core.auth import auth_service, session_store, get_current_user

router = APIRouter()


@router.get("/auth/google")
async def auth_google():
<<<<<<< HEAD
    """Initiate Google OAuth flow"""
    # Generate state parameter for CSRF protection
    state = secrets.token_urlsafe(32)
    
    # Store state in session (in a real app, you'd use a proper session store)
    # For demo purposes, we'll use a simple approach
    oauth_state_storage = {}
    oauth_state_storage[state] = time.time()
    
    # Generate OAuth URL
    auth_url = auth_service.generate_oauth_url(state)
    
    return RedirectResponse(url=auth_url)
>>>>>>> dev-story-1.3

@router.get("/auth/google/callback")
async def auth_google_callback(
    request: Request,
    code: Optional[str] = None,
    state: Optional[str] = None,
    error: Optional[str] = None
):
    """Handle Google OAuth callback"""
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth error: {error}"
        )
    
    if not code or not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required parameters"
        )
    
    # Verify state (in a real app, you'd check against stored state)
    # For demo purposes, we'll skip this check
    
    # Exchange code for tokens
    tokens = auth_service.exchange_code_for_tokens(code)
    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange code for tokens"
        )
    
    # Get user information
    user_info = auth_service.get_user_info(tokens.access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get user information"
        )
    
    # Store refresh token securely
    auth_service.store_refresh_token_securely(user_info.id, tokens.refresh_token)
    
    # Create user session
    session = auth_service.create_user_session(user_info, tokens.access_token)
    
    # Store session
    session_store[session.session_id] = session
    
    # Create response with session cookie
    response = RedirectResponse(url="/")
    response.set_cookie(
        key="session_id",
        value=auth_service.create_session_cookie(session.session_id),
        httponly=True,
        secure=False,  # Set to True in production
        samesite="lax",
        max_age=3600 * auth_service.session_expire_hours
    )
    
    return response


@router.get("/auth/logout")
async def auth_logout(request: Request):
    """Logout user"""
    user = get_current_user(request)
    if user:
        # Delete refresh token
        auth_service.delete_refresh_token_securely(user.id)
        
        # Remove session
        session_cookie = request.cookies.get("session_id")
        if session_cookie:
            session_id = auth_service.validate_session_cookie(session_cookie)
            if session_id and session_id in session_store:
                del session_store[session_id]
    
    # Clear session cookie
    response = RedirectResponse(url="/")
    response.delete_cookie("session_id")
    
    return response


@router.get("/auth/me")
async def get_current_user_info(request: Request):
    """Get current user information"""
    user = get_current_user(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture
    }


@router.get("/auth/status")
async def auth_status(request: Request):
    """Check authentication status"""
    user = get_current_user(request)
    return {
        "authenticated": user is not None,
        "user": user.dict() if user else None
    }