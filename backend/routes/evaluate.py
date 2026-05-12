import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

from fastapi import APIRouter, HTTPException, status
from openai import OpenAIError
from pydantic import ValidationError

from models.schemas import ErrorResponse, EvaluationResult, SubmissionRequest
from services.ai_engine import AIEvaluationEngine

logger = logging.getLogger(__name__)

_engine: AIEvaluationEngine | None = None


@asynccontextmanager
async def _evaluate_lifespan(_app: Any) -> AsyncIterator[None]:
    global _engine
    _engine = AIEvaluationEngine()
    logger.info("Evaluation engine ready")
    try:
        yield
    finally:
        _engine = None


router = APIRouter(tags=["Evaluation"], lifespan=_evaluate_lifespan)


def _get_engine() -> AIEvaluationEngine:
    if _engine is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Evaluation engine is not initialized.",
        )
    return _engine


@router.post(
    "/evaluate",
    response_model=EvaluationResult,
    responses={
        500: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
    },
    summary="Evaluate a candidate submission with the AI engine",
)
async def evaluate_submission(payload: SubmissionRequest) -> EvaluationResult:
    engine = _get_engine()
    try:
        return await engine.evaluate_submission(payload)
    except OpenAIError as exc:
        logger.error("OpenAI error during evaluate_submission: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI evaluation failed. Please try again later.",
        ) from exc
    except (ValueError, ValidationError, RuntimeError) as exc:
        logger.error("AI evaluation failed: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI evaluation failed. Please try again later.",
        ) from exc


@router.get(
    "/health",
    summary="Evaluation service health",
)
async def evaluation_health() -> dict[str, str]:
    return {"status": "ok", "service": "evaluation"}
