from sqlalchemy import Column, Integer, String, Float, Text, JSON, ForeignKey
from backend.core.database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True, unique=True)
    role = Column(String, index=True) # e.g., "Frontend Developer", "Backend Developer"
    experience_level = Column(String, default="Junior") # Junior, Mid, Senior, Lead
    assessment_type = Column(String, default="General") # e.g., "Full Stack", "Data Analyst"
    resume_url = Column(String, nullable=True)
    
    overall_score = Column(Float, default=0.0)
    
    # Store lists as JSON in the database
    strengths = Column(JSON, default=list) 
    weaknesses = Column(JSON, default=list)
    
    hiring_recommendation = Column(String, default="Pending") # "Hire", "Strong Hire", "No Hire"
    ai_feedback = Column(Text, default="")
    technical_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    problem_solving_score = Column(Float, default=0.0)
    recruiter_summary = Column(Text, default="")
    
    # Optional: store full raw submission data if needed
    submission_data = Column(JSON, default=dict)
    
    # Pipeline Status: "Not Attended", "Attending", "Evaluated", "Shortlisted", "Rejected"
    status = Column(String, default="Not Attended")
    rejection_reason = Column(Text, default="")
    recruiter_notes = Column(Text, default="")
    
    # Authenticity & Security Metrics
    plagiarism_score = Column(Float, default=0.0)
    originality_score = Column(Float, default=100.0)
    plagiarism_risk_level = Column(String, default="Low") # Low, Medium, High
    ai_generated_suspicion = Column(Float, default=0.0)
    authenticity_summary = Column(Text, default="")
    malpractice_flags = Column(JSON, default=list)
    
    # Resume verification & Gap Analysis metrics
    resume_skills = Column(JSON, default=dict)
    proven_skills = Column(JSON, default=dict)
    skill_authenticity_score = Column(Float, default=0.0)
    authenticity_gaps = Column(JSON, default=list)
    growth_nudges = Column(JSON, default=list)
    # Recruiter Intelligence fields
    honesty_score = Column(Float, default=0.0)
    skill_mismatch = Column(JSON, default=dict)
    hidden_talents = Column(JSON, default=dict)
    malpractice_severity = Column(Float, default=0.0)
    claimed_skills_json = Column(JSON, default=dict)
    demonstrated_skills_json = Column(JSON, default=dict)
    ai_content_score = Column(Float, default=0.0)
    # Duplicate plagiarism_score removed – column already defined earlier (line 37).
    # New recruiter intelligence fields
    resume_honesty_index = Column(Float, default=0.0, nullable=True)
    overclaim_risk_score = Column(Float, default=0.0, nullable=True)
    underclaim_score = Column(Float, default=0.0, nullable=True)
    skill_gap_analysis = Column(JSON, default=dict, nullable=True)
    red_flag_alerts = Column(JSON, default=list, nullable=True)
    demonstrated_skills = Column(JSON, default=dict, nullable=True)
    claimed_skills_analysis = Column(JSON, default=dict, nullable=True)
    candidate_strength_summary = Column(Text, default="", nullable=True)
    candidate_weakness_summary = Column(Text, default="", nullable=True)
    edge_case_score = Column(Float, default=0.0, nullable=True)
    consistency_score = Column(Float, default=0.0, nullable=True)
    recruiter_risk_level = Column(String, default="Low")
    final_recruiter_score = Column(Float, default=0.0)



class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(Text)
    type = Column(String) # "info", "warning", "critical", "success"
    is_read = Column(Integer, default=0) # 0 for False, 1 for True (SQLite compatible)
    created_at = Column(String) # ISO timestamp
    
class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, index=True)
    recruiter_id = Column(String, default="REC-001")
    interview_title = Column(String, default="Technical Interview")
    scheduled_time = Column(String, nullable=True) # ISO Datetime
    mode = Column(String, default="Online") # "Online" or "Offline"
    meeting_link = Column(String, default="https://meet.google.com/ph-interview-room")
    status = Column(String, default="Scheduled") # "Scheduled", "Upcoming", "Completed", "Cancelled", "Missed"
    notes = Column(Text, nullable=True)
    created_at = Column(String)

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, index=True)
    recruiter_id = Column(String, index=True, default="REC-001")
    sender_type = Column(String) # "recruiter" or "candidate"
    sender_id = Column(String)
    content = Column(Text)
    timestamp = Column(String)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, index=True) # "recruiter" or "candidate"
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=True)
    created_at = Column(String)

class TaskAssignment(Base):
    __tablename__ = "task_assignments"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), index=True)
    task_id = Column(String, index=True)
    status = Column(String, default="ASSIGNED") # ASSIGNED, IN_PROGRESS, SUBMITTED, EVALUATING, EVALUATED
    difficulty = Column(String, default="Medium")
    duration = Column(Integer, default=60) # minutes
    custom_prompt = Column(Text, nullable=True)
    custom_title = Column(String, nullable=True)
    draft_answer = Column(Text, default="")
    time_left_seconds = Column(Integer, nullable=True)
    malpractice_log = Column(JSON, default=list)
    assigned_at = Column(String)
    submitted_at = Column(String, nullable=True)
