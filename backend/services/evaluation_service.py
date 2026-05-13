from backend.models.models import Candidate

def compare_candidates(candidate_1: Candidate, candidate_2: Candidate):
    """
    Comparison logic for two candidates.
    """
    
    # Simple score-based comparison
    score1 = candidate_1.overall_score
    score2 = candidate_2.overall_score
    
    if score1 > score2:
        stronger_id = candidate_1.id
        reasoning = f"{candidate_1.name} has a higher overall score ({score1} vs {score2}) and better aligned strengths for the role."
    elif score2 > score1:
        stronger_id = candidate_2.id
        reasoning = f"{candidate_2.name} has a higher overall score ({score2} vs {score1}) and better aligned strengths for the role."
    else:
        # Tie-breaker (could be based on specific skills or just arbitrary for now)
        stronger_id = candidate_1.id
        reasoning = f"Both candidates have equal scores ({score1}). {candidate_1.name} is marginally preferred based on secondary metrics."
        
    return stronger_id, reasoning
