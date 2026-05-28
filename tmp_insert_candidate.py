import sys
sys.path.append('c:/Projects/RecruitAi')

from backend.core.database import SessionLocal
from backend.models.models import Candidate
import json

def main():
    db = SessionLocal()
    try:
        # Create a sample candidate
        cand = Candidate(
            name='John Doe',
            email='john.doe@example.com',
            role='Backend Developer',
            experience_level='Mid',
            assessment_type='Full Stack',
            claimed_skills_json={"SQL": "Advanced", "Python": "Expert", "Docker": "Intermediate"},
            demonstrated_skills_json={"SQL": "Intermediate", "Python": "Expert", "Docker": "Beginner"},
            strengths=['Problem solving', 'Team player'],
            weaknesses=['Time management'],
            hiring_recommendation='Pending',
            plagiarism_score=0.0,
            ai_generated_suspicion=0.0,
            malpractice_flags=[],
        )
        db.add(cand)
        db.commit()
        db.refresh(cand)
        print('Inserted candidate ID:', cand.id)
    finally:
        db.close()

if __name__ == '__main__':
    main()
