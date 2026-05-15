from typing import Any, Dict, Optional

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.models import models
from backend.routers.notifications import create_notification
from backend.services.llama_service import evaluate_candidate_mock


def evaluate_and_store_submission(
    db: Session,
    name: str,
    role: str,
    submission_data: Dict[str, Any],
    email: Optional[str] = None,
) -> models.Candidate:
    if not name.strip():
        raise HTTPException(status_code=422, detail="Candidate name is required")
    if not role.strip():
        raise HTTPException(status_code=422, detail="Candidate role is required")
    if not submission_data:
        raise HTTPException(status_code=422, detail="Submission data is required")

    ai_result = evaluate_candidate_mock(
        name=name,
        role=role,
        submission_data=submission_data,
    )

    existing = _find_existing_candidate(db, name=name, email=email)
    candidate = existing or models.Candidate()

    candidate.name = name
    candidate.email = email or candidate.email
    candidate.role = role
    candidate.overall_score = ai_result["overall_score"]
    candidate.strengths = ai_result["strengths"]
    candidate.weaknesses = ai_result["weaknesses"]
    candidate.hiring_recommendation = ai_result["hiring_recommendation"]
    candidate.ai_feedback = ai_result["ai_feedback"]
    candidate.submission_data = submission_data
    candidate.plagiarism_score = ai_result.get("plagiarism_score", 0.0)
    candidate.originality_score = ai_result.get("originality_score", 100.0)
    candidate.plagiarism_risk_level = ai_result.get("plagiarism_risk_level", "Low")
    candidate.ai_generated_suspicion = ai_result.get("ai_generated_suspicion", 0.0)
    candidate.authenticity_summary = ai_result.get("authenticity_summary", "")
    candidate.malpractice_flags = ai_result.get("malpractice_flags", [])
    candidate.status = "Evaluated"

    try:
        if not existing:
            db.add(candidate)
        db.commit()
        db.refresh(candidate)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save submission") from exc

    if candidate.plagiarism_risk_level == "High":
        create_notification(
            db,
            "High Risk Detected",
            f"Candidate {candidate.name} flagged for high plagiarism ({candidate.plagiarism_score}%).",
            "critical",
        )

    return candidate


def _find_existing_candidate(
    db: Session,
    name: str,
    email: Optional[str] = None,
) -> Optional[models.Candidate]:
    if email:
        existing = db.query(models.Candidate).filter(models.Candidate.email == email).first()
        if existing:
            return existing

    return db.query(models.Candidate).filter(models.Candidate.name == name).first()
