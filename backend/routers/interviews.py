from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime
from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas

router = APIRouter(
    prefix="/api/interviews",
    tags=["interviews"]
)

def _parse_simulation_notes(notes: str):
    if not notes:
        return {}

    try:
        parsed = json.loads(notes)
    except (TypeError, json.JSONDecodeError):
        return {}

    return parsed if isinstance(parsed, dict) else {}


def _sync_interview_malpractice(interview: models.Interview, candidate: models.Candidate, db: Session):
    simulation = _parse_simulation_notes(interview.notes)
    interview_flags = simulation.get("malpractice_flags") or []
    if not interview_flags:
        return []

    existing_flags = candidate.malpractice_flags or []
    if not isinstance(existing_flags, list):
        existing_flags = [str(existing_flags)]

    seen = {str(flag).strip() for flag in existing_flags if str(flag).strip()}
    new_flags = []
    for flag in interview_flags:
        text = str(flag).strip()
        if text and text not in seen:
            new_flags.append(text)
            seen.add(text)

    if not new_flags:
        return []

    candidate.malpractice_flags = existing_flags + new_flags
    candidate.malpractice_severity = min(len(candidate.malpractice_flags) * 20, 100)

    notification = models.Notification(
        title="Interview Malpractice Warning",
        message=f"{candidate.name} completed an interview with {len(new_flags)} new proctoring flag(s).",
        type="critical" if candidate.malpractice_severity >= 60 else "warning",
        created_at=datetime.now().isoformat()
    )
    db.add(notification)
    return new_flags


@router.post("/schedule", response_model=schemas.InterviewResponse)
def schedule_interview(request: schemas.InterviewScheduleRequest, db: Session = Depends(get_db)):
    # 1. Verify candidate exists
    candidate = db.query(models.Candidate).filter(models.Candidate.id == request.candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # 2. Create interview record
    new_interview = models.Interview(
        candidate_id=request.candidate_id,
        recruiter_id=request.recruiter_id,
        interview_title=request.interview_title,
        scheduled_time=request.scheduled_time,
        mode=request.mode,
        status="Scheduled",
        notes=request.notes,
        created_at=datetime.now().isoformat()
    )
    db.add(new_interview)
    
    # 3. Update candidate status
    candidate.status = "Interview Scheduled"
    
    # 4. Create notification
    notification = models.Notification(
        title="Interview Scheduled",
        message=f"Interview with {candidate.name} scheduled for {request.scheduled_time}.",
        type="success",
        created_at=datetime.now().isoformat()
    )
    db.add(notification)
    
    db.commit()
    db.refresh(new_interview)
    
    # Map candidate details to response
    response = schemas.InterviewResponse.model_validate(new_interview)
    response.candidate_name = candidate.name
    response.candidate_role = candidate.role
    return response

@router.get("/", response_model=List[schemas.InterviewResponse])
def get_all_interviews(db: Session = Depends(get_db)):
    interviews = db.query(models.Interview).all()
    results = []
    for interview in interviews:
        candidate = db.query(models.Candidate).filter(models.Candidate.id == interview.candidate_id).first()
        item = schemas.InterviewResponse.model_validate(interview)
        if candidate:
            item.candidate_name = candidate.name
            item.candidate_role = candidate.role
        results.append(item)
    return results

@router.patch("/{id}", response_model=schemas.InterviewResponse)
def update_interview(id: int, status: str, db: Session = Depends(get_db)):
    interview = db.query(models.Interview).filter(models.Interview.id == id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview.status = status
    
    # If completed, we might want to update candidate status again
    candidate = db.query(models.Candidate).filter(models.Candidate.id == interview.candidate_id).first()
    if status == "Completed" and candidate:
        candidate.status = "Interview Completed"
        _sync_interview_malpractice(interview, candidate, db)
    elif status == "Cancelled" and candidate:
        candidate.status = "Interview Cancelled"
            
    db.commit()
    db.refresh(interview)
    
    response = schemas.InterviewResponse.model_validate(interview)
    if candidate:
        response.candidate_name = candidate.name
        response.candidate_role = candidate.role
    return response

@router.get("/detail/{interview_id}", response_model=schemas.InterviewResponse)
def get_interview_by_id(interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    candidate = db.query(models.Candidate).filter(models.Candidate.id == interview.candidate_id).first()
    response = schemas.InterviewResponse.model_validate(interview)
    if candidate:
        response.candidate_name = candidate.name
        response.candidate_role = candidate.role
    return response

@router.patch("/{id}/simulation", response_model=schemas.InterviewResponse)
def update_interview_simulation(
    id: int,
    request: schemas.InterviewSimulationUpdate,
    db: Session = Depends(get_db),
):
    interview = db.query(models.Interview).filter(models.Interview.id == id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    interview.notes = json.dumps({
        "recruiter_notes": request.recruiter_notes,
        "transcript": request.transcript,
        "scores": request.scores,
        "simulation_status": request.simulation_status,
        "active_question": request.active_question,
        "ai_evaluation": request.ai_evaluation,
        "malpractice_flags": request.malpractice_flags,
    })
    db.commit()
    db.refresh(interview)

    candidate = db.query(models.Candidate).filter(models.Candidate.id == interview.candidate_id).first()
    response = schemas.InterviewResponse.model_validate(interview)
    if candidate:
        response.candidate_name = candidate.name
        response.candidate_role = candidate.role
    return response

@router.get("/{candidate_id}", response_model=List[schemas.InterviewResponse])
def get_interviews_by_candidate(candidate_id: int, db: Session = Depends(get_db)):
    interviews = db.query(models.Interview).filter(models.Interview.candidate_id == candidate_id).all()
    results = []
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    for interview in interviews:
        item = schemas.InterviewResponse.model_validate(interview)
        if candidate:
            item.candidate_name = candidate.name
            item.candidate_role = candidate.role
        results.append(item)
    return results
