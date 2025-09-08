from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.core.middleware import auth_middleware
from app.core.middleware import require_auth

app = FastAPI(
    title="Tenex Take Home API",
    description="Backend API for Tenex take home project",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD
    allow_origins=["http://localhost:3000"],  # Frontend URL
=======
    allow_origins=["http://localhost:3002"],  # Frontend URL
>>>>>>> dev-story-1.3
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add authentication middleware
@app.middleware("http")
async def auth_middleware_wrapper(request: Request, call_next):
    return await auth_middleware(request, call_next)

# Include auth routes
app.include_router(auth_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Tenex Take Home API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/v1/protected")
async def protected_route(request: Request, user=Depends(require_auth)):
    """Example protected route"""
    return {
        "message": "This is a protected route",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }