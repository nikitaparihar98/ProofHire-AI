from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas

router = APIRouter(
    prefix="/api/messages",
    tags=["messages"]
)

@router.post("/send", response_model=schemas.MessageResponse)
def send_message(request: schemas.MessageSendRequest, db: Session = Depends(get_db)):
    if request.sender_type not in {"recruiter", "candidate"}:
        raise HTTPException(status_code=422, detail="sender_type must be recruiter or candidate")
    if not request.content.strip():
        raise HTTPException(status_code=422, detail="Message content is required")

    # Verify candidate exists
    candidate = db.query(models.Candidate).filter(models.Candidate.id == request.candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    new_message = models.Message(
        candidate_id=request.candidate_id,
        recruiter_id=request.recruiter_id,
        sender_type=request.sender_type,
        sender_id=request.sender_id,
        content=request.content.strip(),
        timestamp=datetime.now().isoformat()
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.get("/conversations", response_model=List[schemas.ConversationPreview])
def get_conversations(db: Session = Depends(get_db)):
    # Get all distinct candidate IDs who have messages
    candidate_ids = [r[0] for r in db.query(models.Message.candidate_id).distinct().all()]
    
    # If no messages, return empty
    if not candidate_ids:
        return []

    # Build response with candidate metadata and last message
    result = []
    for cid in candidate_ids:
        candidate = db.query(models.Candidate).filter(models.Candidate.id == cid).first()
        if not candidate:
            continue
            
        last_msg = db.query(models.Message).filter(models.Message.candidate_id == cid).order_by(models.Message.timestamp.desc()).first()
        
        result.append(schemas.ConversationPreview(
            id=candidate.id,
            name=candidate.name,
            role=candidate.role,
            last_message=last_msg.content if last_msg else "No messages",
            timestamp=last_msg.timestamp if last_msg else datetime.now().isoformat()
        ))
    
    # Sort conversations by last message timestamp (newest first)
    result.sort(key=lambda x: x.timestamp, reverse=True)
    return result

@router.get("/candidate/{candidate_id}/conversations", response_model=List[schemas.ConversationPreview])
def get_candidate_conversations(candidate_id: int, db: Session = Depends(get_db)):
    # Find all distinct recruiter IDs who have messages with this candidate
    recruiter_ids = [r[0] for r in db.query(models.Message.recruiter_id).filter(models.Message.candidate_id == candidate_id).distinct().all()]
    
    # Fallback to REC-001 if no threads exist
    if not recruiter_ids:
        recruiter_ids = ["REC-001"]
        
    result = []
    for rid in recruiter_ids:
        last_msg = db.query(models.Message).filter(
            models.Message.candidate_id == candidate_id,
            models.Message.recruiter_id == rid
        ).order_by(models.Message.timestamp.desc()).first()
        
        company_name = "Primary Recruiter Team"
        if rid == "REC-001":
            company_name = "ProofHire Recruiting Team"
        elif "@" in rid:
            email_parts = rid.split("@")
            if len(email_parts) > 1:
                domain = email_parts[1].split(".")[0].capitalize()
                company_name = f"{domain} Talent Acquisition"
        else:
            company_name = f"Recruiter ({rid})"
            
        result.append(schemas.ConversationPreview(
            id=candidate_id,
            name=company_name,
            role=rid,
            last_message=last_msg.content if last_msg else "Start a new conversation!",
            timestamp=last_msg.timestamp if last_msg else datetime.now().isoformat()
        ))
        
    result.sort(key=lambda x: x.timestamp, reverse=True)
    return result

@router.get("/recruiters", response_model=List[schemas.UserResponse])
def get_recruiters(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "recruiter").all()

@router.get("/{candidate_id}", response_model=List[schemas.MessageResponse])
def get_messages(candidate_id: int, recruiter_id: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Message).filter(models.Message.candidate_id == candidate_id)
    if recruiter_id:
        query = query.filter(models.Message.recruiter_id == recruiter_id)
    return query.order_by(models.Message.timestamp.asc()).all()
