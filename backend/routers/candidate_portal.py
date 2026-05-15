from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas
from backend.services.auth_service import get_current_user, require_role
from backend.services.submission_service import evaluate_and_store_submission
from backend.services.task_service import assign_task_for_role, get_task_by_id

router = APIRouter(
    prefix="/api/candidate/me",
    tags=["candidate-portal"],
)


@router.get("/dashboard", response_model=schemas.CandidateDashboardResponse)
def get_candidate_dashboard(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(current_user, "candidate")
    candidate = _get_candidate_for_user(current_user, db)
    assignment = _get_or_create_assignment(candidate, db)

    return {
        "user": current_user,
        "candidate": candidate,
        "assigned_task": get_task_by_id(assignment.task_id),
        "assignment_id": assignment.id,
        "submission_status": assignment.status,
    }


@router.post("/submit", response_model=schemas.SubmissionResponse)
def submit_candidate_assessment(
    request: schemas.CandidateSelfSubmitRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(current_user, "candidate")
    candidate = _get_candidate_for_user(current_user, db)
    assignment = _get_or_create_assignment(candidate, db)

    if not request.answer.strip():
        raise HTTPException(status_code=422, detail="Answer is required")

    task = get_task_by_id(assignment.task_id)
    submission_data = {
        "task_id": task["id"],
        "task_title": task["title"],
        "answer": request.answer,
        "resume_score": request.resume_score,
        "completion_time": request.completion_time,
        "live_malpractice_flags": request.live_malpractice_flags or [],
    }

    evaluated_candidate = evaluate_and_store_submission(
        db=db,
        name=candidate.name,
        email=candidate.email,
        role=candidate.role,
        submission_data=submission_data,
    )

    assignment.status = "Evaluated"
    assignment.submitted_at = datetime.utcnow().isoformat()
    db.commit()

    return {
        "message": "Submission evaluated successfully",
        "candidate": evaluated_candidate,
    }


def _get_candidate_for_user(current_user: models.User, db: Session) -> models.Candidate:
    if not current_user.candidate_id:
        raise HTTPException(status_code=404, detail="Candidate profile not linked")

    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == current_user.candidate_id
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    return candidate


def _get_or_create_assignment(
    candidate: models.Candidate,
    db: Session,
) -> models.TaskAssignment:
    assignment = db.query(models.TaskAssignment).filter(
        models.TaskAssignment.candidate_id == candidate.id
    ).order_by(models.TaskAssignment.id.desc()).first()

    if assignment:
        return assignment

    task = assign_task_for_role(candidate.role)
    assignment = models.TaskAssignment(
        candidate_id=candidate.id,
        task_id=task["id"],
        status="Assigned",
        assigned_at=datetime.utcnow().isoformat(),
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment
