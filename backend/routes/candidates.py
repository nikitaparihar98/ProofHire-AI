"""In-memory store for evaluation results (replace with a database in production)."""

import logging
from typing import Dict

from fastapi import APIRouter, HTTPException, status

from models.schemas import ErrorResponse, EvaluationResult

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Candidates"])

_store: Dict[str, EvaluationResult] = {}


def _sort_by_score_desc(results: list[EvaluationResult]) -> list[EvaluationResult]:
    return sorted(results, key=lambda r: r.score, reverse=True)


@router.post(
    "/candidates/save",
    response_model=EvaluationResult,
    status_code=status.HTTP_201_CREATED,
    responses={422: {"model": ErrorResponse}},
    summary="Persist an evaluation result after POST /evaluate",
)
async def save_candidate_result(payload: EvaluationResult) -> EvaluationResult:
    _store[payload.candidate_id] = payload
    logger.info("Saved evaluation for candidate_id=%s score=%s", payload.candidate_id, payload.score)
    return payload


@router.get(
    "/candidates",
    response_model=list[EvaluationResult],
    summary="List all evaluated candidates, highest score first",
)
async def list_candidates() -> list[EvaluationResult]:
    return _sort_by_score_desc(list(_store.values()))


@router.get(
    "/candidates/hidden-talents",
    response_model=list[EvaluationResult],
    summary="Candidates flagged with hidden talent, highest score first",
)
async def list_hidden_talents() -> list[EvaluationResult]:
    filtered = [r for r in _store.values() if r.hidden_talent_flag]
    return _sort_by_score_desc(filtered)


@router.get(
    "/candidates/{candidate_id}",
    response_model=EvaluationResult,
    responses={404: {"model": ErrorResponse}},
    summary="Get a single candidate evaluation by id",
)
async def get_candidate(candidate_id: str) -> EvaluationResult:
    result = _store.get(candidate_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate '{candidate_id}' not found.",
        )
    return result
