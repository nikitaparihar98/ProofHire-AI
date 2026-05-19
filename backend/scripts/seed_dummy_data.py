import sys
import os
from datetime import datetime, timedelta

# Add the parent directory to sys.path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from core.database import SessionLocal, engine
from models import models

# Recreate tables to apply schema changes
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db: Session = SessionLocal()
    
    dummy_candidates = [
        {
            "name": "Alex Mercer",
            "role": "Frontend Developer",
            "overall_score": 92.5,
            "strengths": ["Excellent React state management", "Modular architecture"],
            "weaknesses": ["Accessibility standards"],
            "hiring_recommendation": "Highly Recommended",
            "ai_feedback": "Alex demonstrates an exceptional understanding of modern React patterns.",
            "submission_data": {"github_url": "...", "completion_time": "1h 45m"},
            "plagiarism_score": 5.0,
            "originality_score": 95.0,
            "plagiarism_risk_level": "Low",
            "ai_generated_suspicion": 8.0,
            "authenticity_summary": "Highly authentic submission.",
            "malpractice_flags": [],
            "status": "Shortlisted"
        },
        {
            "name": "Jordan Lee",
            "role": "Data Analyst",
            "overall_score": 78.0,
            "strengths": ["Proficient SQL"],
            "weaknesses": ["Inefficient Python loops"],
            "hiring_recommendation": "Strong Hire",
            "ai_feedback": "Jordan provided a solid analysis but could optimize Python logic.",
            "submission_data": {"notebook_url": "...", "completion_time": "2h 10m"},
            "plagiarism_score": 25.0,
            "originality_score": 75.0,
            "plagiarism_risk_level": "Medium",
            "ai_generated_suspicion": 65.0,
            "authenticity_summary": "Partially AI-assisted detected.",
            "malpractice_flags": ["Generic docstrings"],
            "status": "Evaluated"
        },
        {
            "name": "Casey Smith",
            "role": "Backend Engineer",
            "overall_score": 85.0,
            "strengths": ["Functional REST API"],
            "weaknesses": ["Copied boilerplate"],
            "hiring_recommendation": "Not Recommended",
            "ai_feedback": "Code is copied verbatim from a popular boilerplate repo.",
            "submission_data": {"github_url": "...", "completion_time": "0h 45m"},
            "plagiarism_score": 92.0,
            "originality_score": 8.0,
            "plagiarism_risk_level": "High",
            "ai_generated_suspicion": 12.0,
            "authenticity_summary": "Severe plagiarism detected.",
            "malpractice_flags": ["Pasted large block", "Matches known source"],
            "status": "Rejected"
        },
        {
            "name": "Sam Taylor",
            "role": "Product Manager",
            "overall_score": 45.0,
            "strengths": ["Good writing"],
            "weaknesses": ["Missed prompt constraints"],
            "hiring_recommendation": "Not Recommended",
            "ai_feedback": "Highly generic AI-generated content.",
            "submission_data": {"notion_url": "...", "completion_time": "0h 20m"},
            "plagiarism_score": 10.0,
            "originality_score": 90.0,
            "plagiarism_risk_level": "High",
            "ai_generated_suspicion": 98.0,
            "authenticity_summary": "Heavily AI-generated filler detected.",
            "malpractice_flags": ["Excessive tab switching", "AI filler detected"],
            "status": "Evaluated"
        },
        {
            "name": "Morgan Vance",
            "role": "Frontend Developer",
            "overall_score": 0,
            "strengths": [],
            "weaknesses": [],
            "hiring_recommendation": "Pending",
            "ai_feedback": "Assessment not yet submitted.",
            "submission_data": {"added_by": "Recruiter"},
            "plagiarism_score": 0,
            "originality_score": 100,
            "plagiarism_risk_level": "Low",
            "ai_generated_suspicion": 0,
            "authenticity_summary": "Awaiting assessment.",
            "malpractice_flags": [],
            "status": "Not Attended"
        }
    ]

    for data in dummy_candidates:
        candidate = models.Candidate(**data)
        db.add(candidate)
    
    # Seed some notifications
    now = datetime.utcnow()
    dummy_notifications = [
        {
            "title": "High Risk Detected",
            "message": "Casey Smith flagged for severe plagiarism (92%).",
            "type": "critical",
            "created_at": (now - timedelta(hours=2)).isoformat(),
            "is_read": 0
        },
        {
            "title": "Assessment Completed",
            "message": "Sam Taylor has finished their Product Manager test.",
            "type": "success",
            "created_at": (now - timedelta(minutes=45)).isoformat(),
            "is_read": 1
        },
        {
            "title": "Malpractice Warning",
            "message": "Jordan Lee detected switching tabs during assessment.",
            "type": "warning",
            "created_at": (now - timedelta(minutes=10)).isoformat(),
            "is_read": 0
        }
    ]

    for data in dummy_notifications:
        notif = models.Notification(**data)
        db.add(notif)

    db.commit()
    print(f"Successfully seeded {len(dummy_candidates)} candidates and {len(dummy_notifications)} notifications.")
    db.close()

if __name__ == "__main__":
    print("Resetting database for UI overhaul...")
    seed_data()
