from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from .schemas import CandidateResponse, AnalyticsSummary

class SkillMismatchDetail(BaseModel):
    skill: str
    claimed_level: Optional[str] = None
    demonstrated_level: Optional[str] = None
    gap_type: Optional[str] = None  # 'overclaim', 'underclaim', 'hidden_talent'
    confidence: Optional[float] = None

class HiddenTalentDetail(BaseModel):
    skill: str
    confidence: Optional[float] = None
    description: Optional[str] = None

class RedFlagDetail(BaseModel):
    type: str
    severity: str
    message: str
    evidence: Optional[Dict[str, Any]] = None

class CandidateAnalyticsResponse(BaseModel):
    candidate_id: int
    resume_honesty_index: Optional[float] = None
    skill_authenticity_score: Optional[float] = None
    overclaim_risk_score: Optional[float] = None
    underclaim_score: Optional[float] = None
    skill_mismatch: List[SkillMismatchDetail] = []
    hidden_talents: List[HiddenTalentDetail] = []
    red_flags: List[RedFlagDetail] = []
    growth_nudges: List[str] = []
    edge_case_score: Optional[float] = None
    consistency_score: Optional[float] = None
    final_recruiter_score: Optional[float] = None
    recruiter_summary: Optional[str] = None
    candidate: Optional[CandidateResponse] = None

    class Config:
        from_attributes = True

class RecruiterDashboardResponse(BaseModel):
    analytics_summary: AnalyticsSummary
    top_recommended: List[CandidateAnalyticsResponse] = []
    hidden_talents: List[CandidateAnalyticsResponse] = []
    high_risk: List[CandidateAnalyticsResponse] = []

    class Config:
        from_attributes = True

class HiddenTalentResponse(BaseModel):
    candidate_id: int
    skill: str
    confidence: Optional[float] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class RedFlagResponse(BaseModel):
    candidate_id: int
    flags: List[RedFlagDetail] = []

    class Config:
        from_attributes = True
