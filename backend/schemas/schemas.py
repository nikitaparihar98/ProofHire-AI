from pydantic import BaseModel
from typing import List, Optional, Any, Dict

# Schema for incoming evaluation request
class EvaluationRequest(BaseModel):
    name: str
    email: Optional[str] = None
    role: str
    submission_data: Dict[str, Any]

class SubmissionRequest(BaseModel):
    name: str
    email: Optional[str] = None
    role: str
    submission_data: Dict[str, Any]

class SubmissionResponse(BaseModel):
    message: str
    candidate: "CandidateResponse"

class TaskResponse(BaseModel):
    id: str
    role: str
    title: str
    task_type: str
    prompt: str
    evaluation_focus: List[str]
    time_limit_minutes: int

class TaskAssignRequest(BaseModel):
    role: str

class CandidateResultSummary(BaseModel):
    id: int
    name: str
    role: str
    score: float
    score_out_of_10: float
    status: str
    hiring_recommendation: str
    hidden_talent: bool
    why_not_selected: str

class CandidateDecisionInsights(BaseModel):
    candidate_id: int
    score_out_of_10: float
    selected: bool
    hidden_talent: bool
    hidden_talent_reason: str
    why_not_selected: str
    decision_reasoning: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    applied_role: Optional[str] = "Backend Engineer"

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    candidate_id: Optional[int] = None

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class CandidateDashboardResponse(BaseModel):
    user: UserResponse
    candidate: "CandidateResponse"
    assigned_task: TaskResponse
    assignment_id: int
    submission_status: str

class CandidateSelfSubmitRequest(BaseModel):
    answer: str
    resume_score: Optional[float] = None
    completion_time: Optional[str] = None
    live_malpractice_flags: Optional[List[str]] = []

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
