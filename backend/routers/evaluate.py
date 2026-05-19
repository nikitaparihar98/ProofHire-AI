from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

<<<<<<< HEAD
from core.database import get_db
from models import models
from schemas import schemas
from services.llama_service import evaluate_candidate_mock
from routers.notifications import create_notification
=======
from backend.core.database import get_db
from backend.schemas import schemas
from backend.services.submission_service import evaluate_and_store_submission
>>>>>>> origin/geshna-backend

router = APIRouter(
    prefix="/api/evaluate",
    tags=["evaluate"]
)

@router.post("/", response_model=schemas.CandidateResponse)
def evaluate_candidate(request: schemas.EvaluationRequest, db: Session = Depends(get_db)):
    """
    Submit a candidate's test data, evaluate it via AI, and store the result in the database.
    """
<<<<<<< HEAD
    
    # 1. Call the AI Evaluation Engine (Mocked for now)
    ai_result = evaluate_candidate_mock(
        name=request.name,
        role=request.role,
        submission_data=request.submission_data
    )
    
    email = getattr(request, 'email', None)
    
    # 2. Create the Candidate in DB with AI Results
    new_candidate = models.Candidate(
        name=request.name,
        email=email,
        role=request.role,
        overall_score=ai_result["overall_score"],
        strengths=ai_result["strengths"],
        weaknesses=ai_result["weaknesses"],
        hiring_recommendation=ai_result["hiring_recommendation"],
        ai_feedback=ai_result["ai_feedback"],
        submission_data=request.submission_data,
        plagiarism_score=ai_result.get("plagiarism_score", 0.0),
        originality_score=ai_result.get("originality_score", 100.0),
        plagiarism_risk_level=ai_result.get("plagiarism_risk_level", "Low"),
        ai_generated_suspicion=ai_result.get("ai_generated_suspicion", 0.0),
        authenticity_summary=ai_result.get("authenticity_summary", ""),
        malpractice_flags=ai_result.get("malpractice_flags", []),
        status="Evaluated"
    )
    
    # Check for existing candidate to update instead of create? 
    # For now, we update if email or name exists, otherwise create.
    if email:
        existing = db.query(models.Candidate).filter(models.Candidate.email == email).first()
    else:
        existing = db.query(models.Candidate).filter(models.Candidate.name == request.name).first()
    if existing:
        # Update existing
        existing.name = new_candidate.name
        existing.email = email or existing.email
        existing.overall_score = new_candidate.overall_score
        existing.strengths = new_candidate.strengths
        existing.weaknesses = new_candidate.weaknesses
        existing.hiring_recommendation = new_candidate.hiring_recommendation
        existing.ai_feedback = new_candidate.ai_feedback
        existing.submission_data = new_candidate.submission_data
        existing.plagiarism_score = new_candidate.plagiarism_score
        existing.originality_score = new_candidate.originality_score
        existing.plagiarism_risk_level = new_candidate.plagiarism_risk_level
        existing.ai_generated_suspicion = new_candidate.ai_generated_suspicion
        existing.authenticity_summary = new_candidate.authenticity_summary
        existing.malpractice_flags = new_candidate.malpractice_flags
        existing.status = "Evaluated"
        db.commit()
        db.refresh(existing)
        final_candidate = existing
    else:
        db.add(new_candidate)
        db.commit()
        db.refresh(new_candidate)
        final_candidate = new_candidate

    # Trigger notification for high risk
    if final_candidate.plagiarism_risk_level == "High":
        create_notification(
            db,
            "High Risk Detected",
            f"Candidate {final_candidate.name} flagged for high plagiarism ({final_candidate.plagiarism_score}%).",
            "critical"
        )
    
    return final_candidate
=======
    return evaluate_and_store_submission(
        db=db,
        name=request.name,
        email=request.email,
        role=request.role,
        submission_data=request.submission_data,
    )
>>>>>>> origin/geshna-backend
