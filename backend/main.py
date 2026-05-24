"""RecruitAI – FastAPI application entry point."""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.core.database import Base, engine
from backend.models import models
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

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan: startup / shutdown hooks
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not os.getenv("OPENAI_API_KEY"):
        logger.warning("OPENAI_API_KEY is not set – AI endpoints will fail at runtime.")
    logger.info("RecruitAI API started.")
    yield
    logger.info("RecruitAI API shutting down.")

# Create database tables
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

app = FastAPI(
    title="ProofHire AI API",
    description="API for ProofHire AI candidate evaluation platform",
    version="1.0.0",
    lifespan = lifespan
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global exception handler
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception on %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )


# Include routers
app.include_router(candidates.router)
app.include_router(evaluate.router)
app.include_router(submissions.router)
app.include_router(tasks.router)
app.include_router(auth.router)
app.include_router(candidate_portal.router)
app.include_router(candidate_portal.assessments_router)
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

@app.get("/api/health")
def api_health_check():
    return {"status": "ok"}

