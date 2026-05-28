from sqlalchemy.orm import Session
from backend.models.models import Candidate


def compare_candidates(candidate_1: Candidate, candidate_2: Candidate):
    score1 = candidate_1.overall_score
    score2 = candidate_2.overall_score

    if score1 > score2:
        return candidate_1.id, f"{candidate_1.name} has higher score ({score1} vs {score2})"
    elif score2 > score1:
        return candidate_2.id, f"{candidate_2.name} has higher score ({score2} vs {score1})"
    else:
        return candidate_1.id, "Both candidates are equal in score"


# ✅ ADD THIS (this is what was missing)
def evaluate_and_store_submission(db: Session, name: str, email: str, role: str, submission_data: dict):
    """
    Creates a candidate + stores evaluation result (basic version).
    """

    candidate = Candidate(
        name=name,
        email=email,
        role=role,
        submission_data=submission_data,
        overall_score=7.0,  # placeholder scoring logic
        status="Evaluated"
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return candidate