from datetime import datetime
import time
import logging

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
    """User signup endpoint with validation and timing logs."""
    # Validate role
    role = request.role.strip().lower()
    if role not in {"recruiter", "candidate"}:
        raise HTTPException(status_code=422, detail="Role must be recruiter or candidate")
    # Validate password length
    if len(request.password) < 6:
        raise HTTPException(status_code=422, detail="Password must be at least 6 characters")
    # Check existing user
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")

    # Candidate handling for candidate role
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

    # Timing and logging
    start_total = time.time()
    logging.info("Signup start")

    # Password hashing timing
    hash_start = time.time()
    password_hash = hash_password(request.password)
    logging.info(f"Password hashed in {time.time() - hash_start:.3f}s")

    # Create user object
    user = models.User(
        name=request.name,
        email=request.email,
        password_hash=password_hash,
        role=role,
        candidate_id=candidate_id,
        created_at=datetime.utcnow().isoformat(),
    )

    # DB operations timing
    db_start = time.time()
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        logging.info(f"DB ops (add/commit/refresh) completed in {time.time() - db_start:.3f}s")
    except IntegrityError as exc:
        db.rollback()
        logging.error("IntegrityError during signup", exc_info=exc)
        raise HTTPException(status_code=409, detail="Email already registered") from exc

    logging.info(f"Signup total time {time.time() - start_total:.3f}s")
    return {
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "user": user,
    }

@router.post("/login", response_model=schemas.AuthResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    """User login endpoint with timing logs."""
    login_start = time.time()
    logging.info("Login start")
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        logging.info(f"Login failed in {time.time() - login_start:.3f}s")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    logging.info(f"Login successful in {time.time() - login_start:.3f}s")
    return {
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "user": user,
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
