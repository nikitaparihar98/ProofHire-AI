from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models.models import Candidate
from backend.services.analytics import update_candidate_analytics
from backend.services.auth_service import get_current_user, require_role

# Import Pydantic analytics schemas
from backend.schemas.analytics_extended import CandidateAnalyticsResponse, RecruiterDashboardResponse, AnalyticsSummary

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
async def get_analytics_summary(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).all()
    completed_statuses = {"Evaluated", "Shortlisted", "Rejected"}

    return AnalyticsSummary(
        total_candidates=len(candidates),
        active_assessments=sum(1 for candidate in candidates if candidate.status == "Attending"),
        completed_assessments=sum(
            1 for candidate in candidates if candidate.status in completed_statuses
        ),
        shortlisted=sum(1 for candidate in candidates if candidate.status == "Shortlisted"),
        rejected=sum(1 for candidate in candidates if candidate.status == "Rejected"),
        high_risk=sum(
            1
            for candidate in candidates
            if candidate.plagiarism_risk_level == "High"
            or candidate.recruiter_risk_level in {"High", "Critical"}
        ),
    )


@router.get("/candidates", response_model=List[CandidateAnalyticsResponse])
async def get_candidates(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    sort_by: Optional[str] = Query(None),
    sort_desc: bool = Query(False),
    filter_risk: Optional[str] = Query(None),
):
    # Ensure recruiter role
    require_role(current_user, "recruiter")

    allowed_sort_fields = {
        "id",
        "honesty_score",
        "final_recruiter_score",
        "technical_score",
        "communication_score",
        "problem_solving_score",
        "malpractice_severity",
    }
    if sort_by and sort_by not in allowed_sort_fields:
        raise HTTPException(status_code=400, detail="Invalid sort field")

    query = db.query(Candidate)
    if filter_risk:
        query = query.filter(Candidate.recruiter_risk_level == filter_risk)
    if sort_by:
        column = getattr(Candidate, sort_by)
        query = query.order_by(column.desc() if sort_desc else column.asc())
    offset = (page - 1) * page_size
    candidates = query.offset(offset).limit(page_size).all()
    return [CandidateAnalyticsResponse.from_orm(c) for c in candidates]

@router.get("/candidates/{candidate_id}", response_model=CandidateAnalyticsResponse)
async def get_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    require_role(current_user, "recruiter")
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return CandidateAnalyticsResponse.from_orm(candidate)

@router.post("/candidates/{candidate_id}/insights", response_model=CandidateAnalyticsResponse)
async def generate_insights(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    require_role(current_user, "recruiter")
    try:
        updated = update_candidate_analytics(db, candidate_id)
        return CandidateAnalyticsResponse.from_orm(updated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/high-risk", response_model=List[CandidateAnalyticsResponse])
async def get_high_risk(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    require_role(current_user, "recruiter")
    try:
        candidates = (
            db.query(Candidate)
            .filter(Candidate.recruiter_risk_level.in_(["High", "Critical"]))
            .all()
        )
        return [CandidateAnalyticsResponse.from_orm(c) for c in candidates]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hidden-talents", response_model=List[CandidateAnalyticsResponse])
async def get_hidden_talents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    require_role(current_user, "recruiter")
    try:
        candidates = (
            db.query(Candidate)
            .filter(Candidate.hidden_talents != {})
            .all()
        )
        return [CandidateAnalyticsResponse.from_orm(c) for c in candidates]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/top-recommended", response_model=List[CandidateAnalyticsResponse])
async def get_top_recommended(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    require_role(current_user, "recruiter")
    try:
        candidates = (
            db.query(Candidate)
            .order_by(Candidate.final_recruiter_score.desc())
            .limit(100)
            .all()
        )
        return [CandidateAnalyticsResponse.from_orm(c) for c in candidates]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
