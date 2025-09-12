from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Callable
from app.core.auth import get_current_user


async def auth_middleware(request: Request, call_next: Callable):
    """Authentication middleware for protected routes"""
    # Skip authentication for certain paths
    excluded_paths = [
        "/api/v1/auth/google",
        "/api/v1/auth/google/callback",
        "/api/v1/auth/logout",
        "/api/v1/auth/status",
        "/api/chat/test-stream",
        "/api/chat/test-stream-real",
        "/api/chat/stream-test",
        "/health",
        "/",
        "/docs",
        "/openapi.json",
        "/redoc"
    ]
    
    if request.url.path in excluded_paths:
        return await call_next(request)
    
    # Check if user is authenticated
    user = get_current_user(request)
    if not user:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Authentication required"}
        )
    
    # Add user to request state for use in route handlers
    request.state.user = user
    
    return await call_next(request)


def require_auth(request: Request):
    """Dependency function to require authentication"""
    user = get_current_user(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return user