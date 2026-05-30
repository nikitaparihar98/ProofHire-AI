from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict


# =========================
# AUTH / USER SCHEMAS
# =========================

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


# =========================
# CANDIDATE SCHEMAS
# =========================

class CandidateBase(BaseModel):
    name: str
    email: Optional[str] = None
    role: str
    experience_level: Optional[str] = "Junior"
    assessment_type: Optional[str] = "General"
    resume_url: Optional[str] = None


class CandidateCreate(CandidateBase):
    overall_score: float = 0.0

    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)

    hiring_recommendation: str = "Pending"
    ai_feedback: str = "Awaiting evaluation."

    technical_score: float = 0.0
    communication_score: float = 0.0
    problem_solving_score: float = 0.0

    recruiter_summary: str = ""

    submission_data: Dict[str, Any] = Field(default_factory=dict)

    plagiarism_score: float = 0.0
    originality_score: float = 100.0
    plagiarism_risk_level: str = "Low"
    hidden_talent: bool = False
    why_not_selected: str = ""


class AnalyticsSummary(BaseModel):
    total_candidates: int
    active_assessments: int
    completed_assessments: int
    shortlisted: int
    rejected: int
    high_risk: int


# =========================
# NOTIFICATIONS
# =========================

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


# =========================
# INTERVIEWS
# =========================

class InterviewScheduleRequest(BaseModel):
    candidate_id: int
    recruiter_id: Optional[str] = "REC-001"
    interview_title: Optional[str] = "Technical Interview"
    scheduled_time: str
    mode: str = "Online"
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


class InterviewSimulationUpdate(BaseModel):
    transcript: List[Dict[str, str]] = Field(default_factory=list)
    scores: Dict[str, int] = Field(default_factory=dict)
    recruiter_notes: str = ""
    simulation_status: str = "not_started"
    active_question: int = 0
    ai_evaluation: Dict[str, Any] = Field(default_factory=dict)
    malpractice_flags: List[str] = Field(default_factory=list)


# =========================
# MESSAGES
# =========================

class MessageSendRequest(BaseModel):
    candidate_id: int
    recruiter_id: Optional[str] = "REC-001"
    sender_type: str
    sender_id: str
    content: str


class MessageResponse(BaseModel):
    id: int
    candidate_id: int
    recruiter_id: Optional[str] = "REC-001"
    sender_type: str
    sender_id: str
    content: str
    timestamp: str

    class Config:
        from_attributes = True


class ConversationPreview(BaseModel):
    id: int
    name: str
    role: str
    last_message: str
    timestamp: str


# =========================
# CANDIDATE SELF FLOW
# =========================

class CandidateSelfSubmitRequest(BaseModel):
    answer: str
    resume_score: Optional[float] = None
    completion_time: Optional[str] = None
    live_malpractice_flags: List[str] = Field(default_factory=list)


class SaveDraftRequest(BaseModel):
    draft_answer: str
    time_left_seconds: int
    malpractice_log: List[Any] = Field(default_factory=list)


class AssessmentSubmitRequest(BaseModel):
    final_answer: str
    malpractice_log: List[Any] = Field(default_factory=list)

class EvaluationRequest(BaseModel):
    name: str
    email: Optional[str] = None
    role: str
    submission_data: Dict[str, Any]


# =========================
# RESUME
# =========================

class ResumeSkillsUploadRequest(BaseModel):
    resume_skills: Dict[str, str]


# =========================
# MISC
# =========================

class CandidateDecisionInsights(BaseModel):
    candidate_id: int
    score_out_of_10: float
    selected: bool
    hidden_talent: bool
    hidden_talent_reason: str
    why_not_selected: str
    decision_reasoning: str


class SubmissionRequest(BaseModel):
    name: str
    email: Optional[str] = None
    role: str
    submission_data: Dict[str, Any]


class SubmissionResponse(BaseModel):
    message: str
    candidate: "CandidateResponse"


class CandidateResultSummary(BaseModel):
    id: int
    name: str
    role: str
    score: float
    score_out_of_10: float
    status: Optional[str] = None
    hiring_recommendation: Optional[str] = None
    hidden_talent: bool = False
    why_not_selected: str = ""


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


class TaskGenerateRequest(BaseModel):
    role: str
    difficulty: str = "Medium"
    tech_stack: str = "Python"


class RecruiterTaskAssignRequest(BaseModel):
    task_id: Optional[str] = None
    difficulty: str = "Medium"
    duration: int = 60
    custom_prompt: Optional[str] = None
    custom_title: Optional[str] = None


class CandidateResponse(CandidateCreate):
    id: int
    status: Optional[str] = None
    class Config:
        from_attributes = True


class CandidateComparisonResponse(BaseModel):
    candidate_1: CandidateResponse
    candidate_2: CandidateResponse
    stronger_candidate_id: int
    reasoning: str


class CandidateDashboardResponse(BaseModel):
    user: UserResponse
    candidate: CandidateResponse
    assigned_task: TaskResponse
    assignment_id: int
    submission_status: str
    scheduled_interviews: int = 0

    class Config:
        from_attributes = True


class DecisionRequest(BaseModel):
    status: str
    reason: Optional[str] = None
    notes: Optional[str] = None


class AssessmentResponse(BaseModel):
    id: int
    candidate_id: int
    task_id: str
    status: str
    difficulty: Optional[str] = None
    duration: Optional[int] = None
    custom_prompt: Optional[str] = None
    custom_title: Optional[str] = None
    draft_answer: Optional[str] = None
    time_left_seconds: Optional[int] = None
    assigned_at: Optional[str] = None
    submitted_at: Optional[str] = None
    task: TaskResponse
    candidate: CandidateResponse
    class Config:
        from_attributes = True
