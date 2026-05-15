from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.database import Base, engine
from backend.models import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProofHire AI API",
    description="API for ProofHire AI candidate evaluation platform",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*" # Fallback for other environments
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.routers import (
    analytics,
    auth,
    candidate_portal,
    candidates,
    evaluate,
    interviews,
    live_sessions,
    messages,
    notifications,
    submissions,
    tasks,
)

# Include routers
app.include_router(candidates.router)
app.include_router(evaluate.router)
app.include_router(submissions.router)
app.include_router(tasks.router)
app.include_router(auth.router)
app.include_router(candidate_portal.router)
app.include_router(live_sessions.router)
app.include_router(analytics.router)
app.include_router(notifications.router)
app.include_router(interviews.router)
app.include_router(messages.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to ProofHire AI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
