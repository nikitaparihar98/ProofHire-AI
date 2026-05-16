from sqlalchemy import Column, Integer, String, Float, Text, JSON
from core.database import Base

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
    status = Column(String, default="Scheduled") # "Scheduled", "Completed", "Cancelled"
    notes = Column(Text, nullable=True)
    created_at = Column(String)

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, index=True)
    sender_type = Column(String) # "recruiter" or "candidate"
    sender_id = Column(String)
    content = Column(Text)
    timestamp = Column(String)
