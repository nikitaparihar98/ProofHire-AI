from pydantic import BaseModel
from typing import List, Optional, Any, Dict

# Schema for incoming evaluation request
class EvaluationRequest(BaseModel):
    name: str
    email: Optional[str] = None
    role: str
    submission_data: Dict[str, Any]

# Schema for candidate representation
class CandidateBase(BaseModel):
    name: str
    email: Optional[str] = None
    role: str
    experience_level: Optional[str] = "Junior"
    assessment_type: Optional[str] = "General"
    resume_url: Optional[str] = None

class CandidateCreate(CandidateBase):
    overall_score: Optional[float] = 0.0
    strengths: Optional[List[str]] = []
    weaknesses: Optional[List[str]] = []
    hiring_recommendation: Optional[str] = "Pending"
    ai_feedback: Optional[str] = "Awaiting evaluation."
    submission_data: Optional[Dict[str, Any]] = {}
    plagiarism_score: Optional[float] = 0.0
    originality_score: Optional[float] = 100.0
    plagiarism_risk_level: Optional[str] = "Low"
    ai_generated_suspicion: Optional[float] = 0.0
    authenticity_summary: Optional[str] = "Not evaluated yet."
    malpractice_flags: Optional[List[str]] = []
    status: Optional[str] = "Not Attended"
    rejection_reason: Optional[str] = ""
    recruiter_notes: Optional[str] = ""

class CandidateResponse(CandidateCreate):
    id: int

    class Config:
        from_attributes = True

# Notification Schemas
class NotificationBase(BaseModel):
    title: str
    message: str
    type: str
    created_at: str

class NotificationResponse(NotificationBase):
    id: int
    is_read: int

    class Config:
        from_attributes = True

# Analytics Schema
class AnalyticsSummary(BaseModel):
    total_candidates: int
    active_assessments: int
    completed_assessments: int
    shortlisted: int
    rejected: int
    high_risk: int

class DecisionRequest(BaseModel):
    status: str
    reason: str = ""
    notes: str = ""

# Schema for comparing two candidates
class CandidateComparisonResponse(BaseModel):
    candidate_1: CandidateResponse
    candidate_2: CandidateResponse
    stronger_candidate_id: int
    reasoning: str

# Interview Schemas
class InterviewScheduleRequest(BaseModel):
    candidate_id: int
    recruiter_id: Optional[str] = "REC-001"
    interview_title: Optional[str] = "Technical Interview"
    scheduled_time: str # ISO Datetime
    mode: str = "Online" # "Online" or "Offline"
    notes: Optional[str] = ""

class InterviewResponse(BaseModel):
    id: int
    candidate_id: int
    candidate_name: Optional[str] = "Unknown"
    candidate_role: Optional[str] = ""
    recruiter_id: str
    interview_title: str
    scheduled_time: str
    mode: str
    status: str
    notes: Optional[str]
    created_at: str

    class Config:
        from_attributes = True

# Message Schemas
class MessageSendRequest(BaseModel):
    candidate_id: int
    sender_type: str # "recruiter" or "candidate"
    sender_id: str
    content: str

class MessageResponse(BaseModel):
    id: int
    candidate_id: int
    sender_type: str
    sender_id: str
    content: str
    timestamp: str

    class Config:
        from_attributes = True

class ConversationPreview(BaseModel):
    id: int # candidate_id
    name: str
    role: str
    last_message: str
    timestamp: str
