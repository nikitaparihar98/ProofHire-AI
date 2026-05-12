"""RecruitAI – FastAPI application entry point."""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

app = FastAPI(
    title="RecruitAI",
    description="AI-powered recruitment evaluation and candidate comparison API.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS – tighten allowed origins before deploying to production
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
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


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

from routes.candidates import router as candidates_router  # noqa: E402
from routes.evaluate import router as evaluate_router      # noqa: E402
from routes.compare import router as compare_router        # noqa: E402

app.include_router(candidates_router, prefix="/api/v1")
app.include_router(evaluate_router,   prefix="/api/v1")
app.include_router(compare_router,    prefix="/api/v1")


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Health"], summary="Health check")
async def health() -> dict:
    return {"status": "ok", "version": app.version}
