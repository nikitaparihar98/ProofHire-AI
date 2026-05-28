import sys, os
sys.path.append(os.path.abspath('.'))
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.core.database import Base
from backend.models.models import Candidate
from backend.services.analytics import update_candidate_analytics

# Setup in-memory SQLite for testing
engine = create_engine('sqlite:///test.db', echo=False)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

session = SessionLocal()
# Create a mock candidate with some data
cand = Candidate(
    name='John Doe',
    email='john@example.com',
    claimed_skills_json={"SQL": "Advanced", "Python": "Intermediate"},
    demonstrated_skills_json={"SQL": "Intermediate", "Python": "Intermediate", "Docker": "Beginner"},
    malpractice_flags=[{"type": "copy_paste"}, {"type": "ai_generated"}],
    technical_score=80,
    communication_score=70,
    problem_solving_score=75,
    ai_generated_suspicion=0.2,
    plagiarism_score=5.0,
    strengths=["Fast learner"],
    weaknesses=["Needs mentorship"]
)
session.add(cand)
session.commit()

# Run analytics update
updated = update_candidate_analytics(session, cand.id)
print('Honesty score:', updated.honesty_score)
print('Skill mismatch:', updated.skill_mismatch)
print('Hidden talents:', updated.hidden_talents)
print('Overclaim risk score:', getattr(updated, 'overclaim_risk_score', None))
print('Underclaim score:', getattr(updated, 'underclaim_score', None))
print('Growth nudges:', getattr(updated, 'growth_nudges', None))
print('Red flag alerts:', getattr(updated, 'red_flag_alerts', None))
