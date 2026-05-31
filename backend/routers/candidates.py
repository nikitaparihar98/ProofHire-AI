from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime

from backend.core.database import get_db
from backend.services.task_service import get_task_by_id
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

    list_fields = [
        "strengths",
        "weaknesses",
        "malpractice_flags",
        "authenticity_gaps",
        "growth_nudges",
    ]
    dict_fields = ["submission_data", "resume_skills", "proven_skills"]
    float_fields = [
        "overall_score",
        "technical_score",
        "communication_score",
        "problem_solving_score",
        "plagiarism_score",
        "originality_score",
        "ai_generated_suspicion",
        "skill_authenticity_score",
    ]
    text_defaults = {
        "hiring_recommendation": "Pending",
        "ai_feedback": "Awaiting evaluation.",
        "recruiter_summary": "",
        "status": "Not Attended",
        "rejection_reason": "",
        "recruiter_notes": "",
        "plagiarism_risk_level": "Low",
        "authenticity_summary": "Not evaluated yet.",
    }

    for field in list_fields:
        if getattr(c, field, None) is None:
            setattr(c, field, [])

    for field in dict_fields:
        if getattr(c, field, None) is None:
            setattr(c, field, {})

    for field in float_fields:
        if getattr(c, field, None) is None:
            setattr(c, field, 0.0)

    for field, default in text_defaults.items():
        if getattr(c, field, None) is None:
            setattr(c, field, default)

    if c.originality_score == 0.0:
        c.originality_score = 100.0

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
# VERIFICATION
# -----------------------------
@router.patch("/{candidate_id}/verification", response_model=schemas.CandidateResponse)
def toggle_candidate_verification(candidate_id: int, db: Session = Depends(get_db)):

    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate.is_verified = not bool(candidate.is_verified)
    db.commit()
    db.refresh(candidate)

    create_notification(
        db,
        "Candidate Verification Updated",
        f"{candidate.name} is now {'verified' if candidate.is_verified else 'unverified'}.",
        "success" if candidate.is_verified else "info",
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

# -----------------------------
# ASSIGN TASK TO CANDIDATE
# -----------------------------
@router.post("/{candidate_id}/assign-task", response_model=schemas.TaskResponse)
def assign_task_to_candidate(
    candidate_id: int,
    request: schemas.RecruiterTaskAssignRequest,
    db: Session = Depends(get_db)
):
    """Assign a task (predefined or custom) to a candidate.

    Returns the task details (TaskResponse) for the UI.
    """
    # Verify candidate exists
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Resolve task definition
    if request.custom_title or request.custom_prompt:
        task_def = {
            "id": request.task_id or "custom",
            "role": candidate.role or "Candidate",
            "title": request.custom_title or "Custom Assessment",
            "task_type": "coding",
            "prompt": request.custom_prompt or "",
            "evaluation_focus": ["Recruiter Requirements", "Task Completion"],
            "time_limit_minutes": request.duration,
        }
    elif request.task_id:
        task_def = get_task_by_id(request.task_id)
    else:
        # fallback to first task if none provided
        task_def = get_task_by_id("backend-api-001")

    # Record assignment in database
    task_assignment = models.TaskAssignment(
        candidate_id=candidate_id,
        task_id=task_def["id"],
        difficulty=request.difficulty,
        duration=request.duration,
        custom_prompt=request.custom_prompt,
        custom_title=request.custom_title,
        status="Assigned",
        assigned_at=datetime.datetime.utcnow().isoformat()
    )
    db.add(task_assignment)
    candidate.status = "Assigned"
    db.commit()
    db.refresh(task_assignment)
    db.refresh(candidate)

    create_notification(
        db,
        "Assessment Task Assigned",
        f"{candidate.name} was assigned {task_def['title']}.",
        "success",
    )

    # Return the task definition as TaskResponse schema
    return schemas.TaskResponse(**task_def)
