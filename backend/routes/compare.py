import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

from fastapi import APIRouter, HTTPException, status
from openai import OpenAIError
from pydantic import ValidationError

from models.schemas import (
    CompareRequest,
    CompareResult,
    ErrorResponse,
    WhyNotSelectedRequest,
    WhyNotSelectedResult,
)
from services.ai_engine import AIEvaluationEngine

logger = logging.getLogger(__name__)

_engine: AIEvaluationEngine | None = None


@asynccontextmanager
async def _compare_lifespan(_app: Any) -> AsyncIterator[None]:
    global _engine
    _engine = AIEvaluationEngine()
    logger.info("Comparison AI engine ready")
    try:
        yield
    finally:
        _engine = None


router = APIRouter(tags=["Comparison"], lifespan=_compare_lifespan)


def _get_engine() -> AIEvaluationEngine:
    if _engine is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI engine is not initialized.",
        )
    return _engine


def _handle_ai_error(operation: str, exc: BaseException) -> HTTPException:
    logger.error("%s failed: %s", operation, exc, exc_info=True)
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="AI request failed. Please try again later.",
    )


@router.post(
    "/compare",
    response_model=CompareResult,
    responses={
        500: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
    },
    summary="Compare two candidate submissions and pick a winner",
)
async def compare_candidates(payload: CompareRequest) -> CompareResult:
    engine = _get_engine()
    try:
        return await engine.compare_candidates(payload)
    except OpenAIError as exc:
        raise _handle_ai_error("compare_candidates", exc) from exc
    except (ValueError, ValidationError, RuntimeError) as exc:
        raise _handle_ai_error("compare_candidates", exc) from exc


@router.post(
    "/why-not-selected",
    response_model=WhyNotSelectedResult,
    responses={
        500: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
    },
    summary="Generate a constructive explanation for a candidate not selected",
)
async def why_not_selected(payload: WhyNotSelectedRequest) -> WhyNotSelectedResult:
    engine = _get_engine()
    try:
        return await engine.why_not_selected(payload)
    except OpenAIError as exc:
        raise _handle_ai_error("why_not_selected", exc) from exc
    except (ValueError, ValidationError, RuntimeError) as exc:
        raise _handle_ai_error("why_not_selected", exc) from exc
