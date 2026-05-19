from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
<<<<<<< HEAD
from core.database import get_db
from models import models
from schemas import schemas
from routers.live_sessions import active_sessions
=======
from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas
from backend.routers.live_sessions import active_sessions
>>>>>>> origin/geshna-backend

router = APIRouter(
    prefix="/api/analytics",
    tags=["analytics"]
)

@router.get("/summary", response_model=schemas.AnalyticsSummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    # Calculate counts from database
    total = db.query(func.count(models.Candidate.id)).scalar()
    completed = db.query(func.count(models.Candidate.id)).filter(models.Candidate.status == "Evaluated").scalar()
    shortlisted = db.query(func.count(models.Candidate.id)).filter(models.Candidate.status == "Shortlisted").scalar()
    rejected = db.query(func.count(models.Candidate.id)).filter(models.Candidate.status == "Rejected").scalar()
    high_risk = db.query(func.count(models.Candidate.id)).filter(models.Candidate.plagiarism_risk_level == "High").scalar()
    
    # Active assessments are from the in-memory live session manager
    active = len([s for s in active_sessions.values() if s["status"] == "in_progress"])
    
    return {
        "total_candidates": total or 0,
        "active_assessments": active,
        "completed_assessments": completed or 0,
        "shortlisted": shortlisted or 0,
        "rejected": rejected or 0,
        "high_risk": high_risk or 0
    }
