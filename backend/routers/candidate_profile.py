from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas
from backend.services.auth_service import get_current_user
from backend.services.candidate_service import create_candidate_for_user

router = APIRouter(
    prefix="/api/candidate/me",
    tags=["candidate-profile"],
)

@router.post("/profile", response_model=schemas.CandidateResponse)
def init_candidate_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.candidate_id:
        raise HTTPException(status_code=400, detail="Profile already exists")
    candidate = create_candidate_for_user(current_user, db)
    return candidate
