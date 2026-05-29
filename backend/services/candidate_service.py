from sqlalchemy.orm import Session
from backend.models import models

def create_candidate_for_user(user: models.User, db: Session) -> models.Candidate:
    """Create a Candidate linked to the given User and return it."""
    # Derive a name from email if not set
    name = user.name or user.email.split('@')[0].title()
    candidate = models.Candidate(
        name=name,
        email=user.email,
        role="Candidate",
        status="Not Attended",
        ai_feedback="Awaiting assessment.",
    )
    db.add(candidate)
    db.flush()  # assign id without committing
    user.candidate_id = candidate.id
    db.commit()
    db.refresh(candidate)
    db.refresh(user)
    return candidate
