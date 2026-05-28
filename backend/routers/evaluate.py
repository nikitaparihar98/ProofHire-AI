from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.schemas.schemas import EvaluationRequest, CandidateResponse
from backend.services.evaluation_service import evaluate_and_store_submission

router = APIRouter(
    prefix="/api/evaluate",
    tags=["evaluate"]
)


@router.post("/", response_model=CandidateResponse)
def evaluate_candidate(
    request: EvaluationRequest,
    db: Session = Depends(get_db)
):
    """
    Submit a candidate's test data, evaluate it, and store in DB.
    """

    return evaluate_and_store_submission(
        db=db,
        name=request.name,
        email=request.email,
        role=request.role,
        submission_data=request.submission_data,
    )