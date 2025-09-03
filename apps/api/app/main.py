from fastapi import FastAPI

app = FastAPI(
    title="Tenex Take Home API",
    description="Backend API for Tenex take home project",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {"message": "Tenex Take Home API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}