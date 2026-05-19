from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
<<<<<<< HEAD
from core.database import get_db
from models import models
from schemas import schemas
=======
from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas
>>>>>>> origin/geshna-backend

router = APIRouter(
    prefix="/api/messages",
    tags=["messages"]
)

@router.post("/send", response_model=schemas.MessageResponse)
def send_message(request: schemas.MessageSendRequest, db: Session = Depends(get_db)):
    # Verify candidate exists
    candidate = db.query(models.Candidate).filter(models.Candidate.id == request.candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    new_message = models.Message(
        candidate_id=request.candidate_id,
        sender_type=request.sender_type,
        sender_id=request.sender_id,
        content=request.content,
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

@router.get("/{candidate_id}", response_model=List[schemas.MessageResponse])
def get_messages(candidate_id: int, db: Session = Depends(get_db)):
    return db.query(models.Message).filter(models.Message.candidate_id == candidate_id).order_by(models.Message.timestamp.asc()).all()
