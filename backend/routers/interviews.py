from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from core.database import get_db
from models import models
from schemas import schemas

router = APIRouter(
    prefix="/api/interviews",
    tags=["interviews"]
)

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
    elif status == "Cancelled" and candidate:
        candidate.status = "Interview Cancelled"
            
    db.commit()
    db.refresh(interview)
    
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
