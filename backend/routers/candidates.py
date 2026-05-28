from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime

from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas
from backend.services.evaluation_service import compare_candidates
from backend.routers.notifications import create_notification

router = APIRouter(
    prefix="/api/candidates",
    tags=["candidates"]
)


# -----------------------------
# SAFE SERIALIZATION HELPER
# -----------------------------
def normalize_candidate(c):
    """
    Fix schema mismatch issues before FastAPI validation.
    Converts dict-based fields into schema-safe types.
    """

    # growth_nudges fix (dict -> string)
    if isinstance(c.growth_nudges, list):
        c.growth_nudges = [
            (
                f"{x.get('skill','')}: {x.get('suggestion','')}"
                if isinstance(x, dict)
                else str(x)
            )
            for x in c.growth_nudges
        ]

    # authenticity_gaps fix
    if isinstance(c.authenticity_gaps, list):
        c.authenticity_gaps = [str(x) for x in c.authenticity_gaps]

    # malpractice_flags fix
    if isinstance(c.malpractice_flags, list):
        c.malpractice_flags = [str(x) for x in c.malpractice_flags]

    c.has_malpractice = len(c.malpractice_flags) > 0
    return c


# -----------------------------
# GET ALL CANDIDATES
# -----------------------------
@router.get("/", response_model=List[schemas.CandidateResponse])
def get_candidates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):

    candidates = (
        db.query(models.Candidate)
        .order_by(models.Candidate.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    # 🔥 FIX APPLIED HERE
    return [normalize_candidate(c) for c in candidates]


# -----------------------------
# CREATE CANDIDATE
# -----------------------------
@router.post("/", response_model=schemas.CandidateResponse)
def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):

    db_candidate = models.Candidate(**candidate.model_dump())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)

    create_notification(
        db,
        "New Candidate Profile",
        f"Recruiter added {db_candidate.name} as a {db_candidate.role}.",
        "info"
    )

    return normalize_candidate(db_candidate)


# -----------------------------
# BULK CREATE
# -----------------------------
@router.post("/bulk", response_model=List[schemas.CandidateResponse])
def bulk_create_candidates(candidates: List[schemas.CandidateCreate], db: Session = Depends(get_db)):

    created_candidates = []

    for cand_data in candidates:
        db_candidate = models.Candidate(**cand_data.model_dump())
        db_candidate.status = "Not Attended"
        db.add(db_candidate)
        created_candidates.append(db_candidate)

    db.commit()

    for c in created_candidates:
        db.refresh(c)

    create_notification(
        db,
        "Bulk Candidates Added",
        f"Recruiter uploaded {len(created_candidates)} new candidates to the pipeline.",
        "info"
    )

    return [normalize_candidate(c) for c in created_candidates]


# -----------------------------
# DECISION
# -----------------------------
@router.patch("/{candidate_id}/decision", response_model=schemas.CandidateResponse)
def decide_candidate(candidate_id: int, request: schemas.DecisionRequest, db: Session = Depends(get_db)):

    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate.status = request.status

    if request.reason:
        candidate.rejection_reason = request.reason

    if request.notes:
        candidate.recruiter_notes = request.notes

    db.commit()
    db.refresh(candidate)

    create_notification(
        db,
        f"Candidate {request.status}",
        f"{candidate.name} has been {request.status.lower()} by recruiter.",
        "success" if request.status == "Shortlisted" else "info"
    )

    return normalize_candidate(candidate)


# -----------------------------
# COMPARE CANDIDATES
# -----------------------------
@router.get("/compare", response_model=schemas.CandidateComparisonResponse)
def compare_two_candidates(candidate1_id: int, candidate2_id: int, db: Session = Depends(get_db)):

    c1 = db.query(models.Candidate).filter(models.Candidate.id == candidate1_id).first()
    c2 = db.query(models.Candidate).filter(models.Candidate.id == candidate2_id).first()

    if not c1 or not c2:
        raise HTTPException(status_code=404, detail="One or both candidates not found")

    stronger_id, reasoning = compare_candidates(c1, c2)

    return schemas.CandidateComparisonResponse(
        candidate_1=normalize_candidate(c1),
        candidate_2=normalize_candidate(c2),
        stronger_candidate_id=stronger_id,
        reasoning=reasoning
    )


# -----------------------------
# GET CANDIDATE
# -----------------------------
@router.get("/{candidate_id}", response_model=schemas.CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):

    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    return normalize_candidate(candidate)