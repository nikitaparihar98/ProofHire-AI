import sys
import os
from datetime import datetime

# Add parent directory to path to enable imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from backend.core.database import SessionLocal, Base, engine
from backend.models import models
from backend.services.auth_service import hash_password

def seed_demo_users():
    db: Session = SessionLocal()
    
    # 1. Ensure candidates exist
    print("Checking candidate profiles...")
    alex = db.query(models.Candidate).filter(models.Candidate.name == "Alex Mercer").first()
    if not alex:
        print("Seeding default candidates first...")
        # Create standard candidates
        alex = models.Candidate(
            name="Alex Mercer",
            email="candidate@proofhire.ai",
            role="Frontend Developer",
            overall_score=92.5,
            strengths=["React Mastery", "Tailwind CSS", "Component Design"],
            weaknesses=["GraphQL Experience"],
            hiring_recommendation="Strong Hire",
            ai_feedback="Alex showed exceptional skill in building robust, reusable UI components.",
            submission_data={"repo_url": "github.com/alex/test", "time_taken": "2h"},
            status="Shortlisted"
        )
        db.add(alex)
        db.flush()
        
    # 2. Seed Recruiter User
    recruiter_email = "recruiter@proofhire.ai"
    existing_recruiter = db.query(models.User).filter(models.User.email == recruiter_email).first()
    if not existing_recruiter:
        print(f"Creating recruiter user: {recruiter_email}...")
        recruiter_user = models.User(
            name="Nikit Parihar",
            email=recruiter_email,
            password_hash=hash_password("password"),
            role="recruiter",
            candidate_id=None,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(recruiter_user)
    else:
        print(f"Recruiter user {recruiter_email} already exists.")
        
    # 3. Seed Candidate User
    candidate_email = "candidate@proofhire.ai"
    existing_candidate = db.query(models.User).filter(models.User.email == candidate_email).first()
    if not existing_candidate:
        print(f"Creating candidate user: {candidate_email}...")
        candidate_user = models.User(
            name="Alex Mercer",
            email=candidate_email,
            password_hash=hash_password("password"),
            role="candidate",
            candidate_id=alex.id,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(candidate_user)
    else:
        print(f"Candidate user {candidate_email} already exists.")
        
    db.commit()
    print("Demo users successfully seeded!")
    db.close()

if __name__ == "__main__":
    seed_demo_users()
