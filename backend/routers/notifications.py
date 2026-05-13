from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas

router = APIRouter(
    prefix="/api/notifications",
    tags=["notifications"]
)

@router.get("/", response_model=List[schemas.NotificationResponse])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(models.Notification).order_by(models.Notification.created_at.desc()).limit(20).all()

@router.post("/read/{notif_id}")
def mark_as_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if notif:
        notif.is_read = 1
        db.commit()
    return {"status": "success"}

@router.post("/clear-all")
def clear_all_notifications(db: Session = Depends(get_db)):
    db.query(models.Notification).update({models.Notification.is_read: 1})
    db.commit()
    return {"status": "success"}

# Internal utility to create notifications
def create_notification(db: Session, title: str, message: str, n_type: str = "info"):
    new_notif = models.Notification(
        title=title,
        message=message,
        type=n_type,
        created_at=datetime.utcnow().isoformat(),
        is_read=0
    )
    db.add(new_notif)
    db.commit()
