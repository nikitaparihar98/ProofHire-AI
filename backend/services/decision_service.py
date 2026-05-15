from backend.models.models import Candidate


def score_out_of_10(candidate: Candidate) -> float:
    return round((candidate.overall_score or 0) / 10, 1)


def is_hidden_talent(candidate: Candidate) -> bool:
    submission_data = candidate.submission_data or {}
    resume_score = submission_data.get("resume_score")
    weak_resume_signal = submission_data.get("weak_resume") is True

    if resume_score is not None:
        return float(resume_score) <= 50 and (candidate.overall_score or 0) >= 75

    return (
        weak_resume_signal
        or candidate.experience_level == "Junior"
    ) and (candidate.overall_score or 0) >= 80


def hidden_talent_reason(candidate: Candidate) -> str:
    if not is_hidden_talent(candidate):
        return ""

    submission_data = candidate.submission_data or {}
    resume_score = submission_data.get("resume_score")
    if resume_score is not None:
        return (
            f"Resume signal is modest ({resume_score}/100), but task performance "
            f"is strong ({candidate.overall_score}/100)."
        )

    return (
        "Candidate has a weaker profile signal but performed strongly on the task, "
        "so they should be reviewed before filtering by resume alone."
    )


def why_not_selected(candidate: Candidate) -> str:
    score = candidate.overall_score or 0
    risk = candidate.plagiarism_risk_level or "Low"
    weaknesses = candidate.weaknesses or []

    if candidate.status == "Shortlisted":
        return ""

    if risk == "High":
        return (
            "Not selected because the submission has a high integrity risk. "
            "The recruiter should review authenticity concerns before moving forward."
        )

    if score < 60:
        return (
            "Not selected because the task score is below the expected bar. "
            f"Main improvement areas: {_format_weaknesses(weaknesses)}."
        )

    if score < 75:
        return (
            "Not selected yet because the submission is promising but not clearly above "
            f"the shortlist threshold. Main improvement areas: {_format_weaknesses(weaknesses)}."
        )

    if candidate.status == "Rejected":
        return (
            "Rejected by recruiter despite a workable score. Review recruiter notes "
            "and compare against stronger candidates before finalizing."
        )

    return "Not selected yet because the recruiter has not made a final shortlist decision."


def decision_reasoning(candidate: Candidate) -> str:
    score = candidate.overall_score or 0
    score_10 = score_out_of_10(candidate)

    if is_hidden_talent(candidate):
        return (
            f"{candidate.name} is a Hidden Talent candidate: {score_10}/10 task performance "
            "with weaker resume signals. Prioritize a human review."
        )

    if score >= 85:
        return f"{candidate.name} is a strong match with a {score_10}/10 task score."

    if score >= 70:
        return f"{candidate.name} is a possible match with a {score_10}/10 task score."

    return (
        f"{candidate.name} is below the current shortlist bar with a {score_10}/10 task score."
    )


def _format_weaknesses(weaknesses: list) -> str:
    if not weaknesses:
        return "no specific weaknesses were recorded"

    return ", ".join(weaknesses[:2])
