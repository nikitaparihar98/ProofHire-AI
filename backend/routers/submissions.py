from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas
from backend.services.decision_service import (
    decision_reasoning,
    hidden_talent_reason,
    is_hidden_talent,
    score_out_of_10,
    why_not_selected,
)
from backend.services.auth_service import require_recruiter
from backend.services.submission_service import evaluate_and_store_submission

router = APIRouter(tags=["submissions"])


@router.post("/api/submit", response_model=schemas.SubmissionResponse)
def submit_assessment(
    request: schemas.SubmissionRequest,
    _recruiter: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    """Submit candidate assessment data and return the stored evaluation result."""
    candidate = evaluate_and_store_submission(
        db=db,
        name=request.name,
        email=request.email,
        role=request.role,
        submission_data=request.submission_data,
    )

    return {
        "message": "Submission evaluated successfully",
        "candidate": candidate,
    }


@router.get("/api/results/{candidate_id}", response_model=schemas.CandidateResponse)
def get_candidate_result(
    candidate_id: int,
    _recruiter: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    """Fetch the evaluated result for a candidate."""
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate result not found")

    return candidate


@router.get("/api/results", response_model=list[schemas.CandidateResultSummary])
def list_ranked_results(
    _recruiter: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    """Return ranked candidate results for the recruiter dashboard."""
    candidates = db.query(models.Candidate).order_by(models.Candidate.overall_score.desc()).all()

    return [
        schemas.CandidateResultSummary(
            id=candidate.id,
            name=candidate.name,
            role=candidate.role,
            score=candidate.overall_score or 0,
            score_out_of_10=score_out_of_10(candidate),
            status=candidate.status,
            hiring_recommendation=candidate.hiring_recommendation,
            hidden_talent=is_hidden_talent(candidate),
            why_not_selected=why_not_selected(candidate),
        )
        for candidate in candidates
    ]


@router.get(
    "/api/results/{candidate_id}/decision-insights",
    response_model=schemas.CandidateDecisionInsights,
)
def get_candidate_decision_insights(
    candidate_id: int,
    _recruiter: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    """Explain selection, rejection, and Hidden Talent signals for one candidate."""
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate result not found")

    selected = candidate.status == "Shortlisted" or (candidate.overall_score or 0) >= 85

    return schemas.CandidateDecisionInsights(
        candidate_id=candidate.id,
        score_out_of_10=score_out_of_10(candidate),
        selected=selected,
        hidden_talent=is_hidden_talent(candidate),
        hidden_talent_reason=hidden_talent_reason(candidate),
        why_not_selected=why_not_selected(candidate),
        decision_reasoning=decision_reasoning(candidate),
    )
