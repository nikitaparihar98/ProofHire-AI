"""RecruitAI – FastAPI application entry point."""

import logging
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

# ---------------------------------------------------------------------
# Load environment variables
# ---------------------------------------------------------------------

load_dotenv()

# ---------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    if not os.getenv("OPENAI_API_KEY"):
        logger.warning("OPENAI_API_KEY is not set – AI endpoints may fail.")

    logger.info("RecruitAI API starting up...")

    # ✅ Safe DB initialization (moved here)
    Base.metadata.create_all(bind=engine)

    yield

    # Shutdown
    logger.info("RecruitAI API shutting down...")

# ---------------------------------------------------------------------
# App
# ---------------------------------------------------------------------

app = FastAPI(
    title="ProofHire AI API",
    description="API for ProofHire AI candidate evaluation platform",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------
# CORS (FIXED - production safe)
# ---------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------

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

# ---------------------------------------------------------------------
# Basic routes
# ---------------------------------------------------------------------

@app.get("/")
def read_root():
    return {"message": "Welcome to ProofHire AI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/health")
def api_health_check():
    return {"status": "ok"}

@app.get("/debug")
def debug():
    return {"ok": True}