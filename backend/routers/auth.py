from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas
from backend.services.auth_service import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)


@router.post("/signup", response_model=schemas.AuthResponse)
def signup(request: schemas.SignupRequest, db: Session = Depends(get_db)):
    role = request.role.strip().lower()
    if role not in {"recruiter", "candidate"}:
        raise HTTPException(status_code=422, detail="Role must be recruiter or candidate")

    if len(request.password) < 6:
        raise HTTPException(status_code=422, detail="Password must be at least 6 characters")

    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")

    candidate_id = None
    if role == "candidate":
        candidate = db.query(models.Candidate).filter(models.Candidate.email == request.email).first()
        if not candidate:
            candidate = models.Candidate(
                name=request.name,
                email=request.email,
                role=request.applied_role or "Backend Engineer",
                status="Not Attended",
                ai_feedback="Awaiting assessment.",
            )
            db.add(candidate)
            db.flush()
        candidate_id = candidate.id

    user = models.User(
        name=request.name,
        email=request.email,
        password_hash=hash_password(request.password),
        role=role,
        candidate_id=candidate_id,
        created_at=datetime.utcnow().isoformat(),
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already registered") from exc

    return {
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "user": user,
    }


@router.post("/login", response_model=schemas.AuthResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
