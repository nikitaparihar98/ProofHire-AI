def detect_hidden_talent(resume_score, overall_score):
    if resume_score < 5 and overall_score > 8:
        return True
    return False