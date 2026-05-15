from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.schemas import schemas
from backend.services.submission_service import evaluate_and_store_submission

router = APIRouter(
    prefix="/api/evaluate",
    tags=["evaluate"]
)

@router.post("/", response_model=schemas.CandidateResponse)
def evaluate_candidate(request: schemas.EvaluationRequest, db: Session = Depends(get_db)):
    """
    Submit a candidate's test data, evaluate it via AI, and store the result in the database.
    """
    return evaluate_and_store_submission(
        db=db,
        name=request.name,
        email=request.email,
        role=request.role,
        submission_data=request.submission_data,
    )
