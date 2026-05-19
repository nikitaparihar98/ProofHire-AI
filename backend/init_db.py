from sqlalchemy.orm import Session
<<<<<<< HEAD
from core.database import SessionLocal, engine, Base
from models import models
=======
from backend.core.database import SessionLocal, engine, Base
from backend.models import models
>>>>>>> origin/geshna-backend

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(models.Candidate).count() == 0:
        candidates = [
            models.Candidate(
                name="Alice Johnson",
                role="Frontend Developer",
                overall_score=92.5,
                strengths=["React Mastery", "Tailwind CSS", "Component Design"],
                weaknesses=["GraphQL Experience"],
                hiring_recommendation="Strong Hire",
                ai_feedback="Alice showed exceptional skill in building robust, reusable UI components. Her understanding of modern frontend architecture is exactly what the team needs.",
                submission_data={"repo_url": "github.com/alice/test", "time_taken": "2h"}
            ),
            models.Candidate(
                name="Bob Smith",
                role="Backend Developer",
                overall_score=78.0,
                strengths=["API Design", "Database Modeling"],
                weaknesses=["Testing", "Error Handling"],
                hiring_recommendation="Hire",
                ai_feedback="Bob has a solid grasp of API fundamentals but lacks rigorous testing practices. Could be a good addition with some mentoring.",
                submission_data={"repo_url": "github.com/bob/api", "time_taken": "3h"}
            ),
            models.Candidate(
                name="Charlie Davis",
                role="Frontend Developer",
                overall_score=65.0,
                strengths=["HTML/CSS"],
                weaknesses=["React Hooks", "State Management"],
                hiring_recommendation="No Hire",
                ai_feedback="Charlie struggled with advanced React concepts, particularly custom hooks and context. Needs more experience before joining at this level.",
                submission_data={"repo_url": "github.com/charlie/ui", "time_taken": "4h"}
            )
        ]
        db.add_all(candidates)
        db.commit()
        print("Database seeded with mock candidates.")
    else:
        print("Database already contains data.")

    db.close()

if __name__ == "__main__":
    seed_data()
