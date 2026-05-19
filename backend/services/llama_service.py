<<<<<<< HEAD
import json
=======
>>>>>>> origin/geshna-backend
from typing import Dict, Any

def evaluate_candidate_mock(name: str, role: str, submission_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mock function to simulate calling the Llama API for candidate evaluation.
    In a real scenario, this would send submission_data to Llama API
    and parse the JSON response.
    """
    
<<<<<<< HEAD
    # This is a dummy response simulating AI analysis
    # Later, you will replace this with an actual HTTP request to Llama API.
    # e.g., requests.post("https://api.llama.ai/v1/chat/completions", headers=...)
    
    mock_response = {
        "overall_score": 85.5,
        "strengths": [
            "Strong understanding of React component lifecycle",
            "Clean and modular code structure",
            "Good use of Tailwind utility classes"
        ] if "frontend" in role.lower() else [
            "Solid API design principles",
            "Efficient database queries",
            "Good error handling"
        ],
        "weaknesses": [
            "Could improve accessibility (a11y) standards",
            "Lacks unit tests"
        ],
        "hiring_recommendation": "Strong Hire",
        "ai_feedback": f"{name} demonstrated excellent problem-solving skills in the {role} assignment. The implementation was robust, though there's room for improvement in writing automated tests.",
        "plagiarism_score": 12.5,
        "originality_score": 87.5,
        "plagiarism_risk_level": "Low",
        "ai_generated_suspicion": 15.0,
        "authenticity_summary": "The submission appears highly original with minimal overlap with common online solutions. No significant AI generation detected.",
        "malpractice_flags": []
    }
    
    return mock_response
=======
    answer = str(submission_data.get("answer", "")).lower()
    flags = submission_data.get("live_malpractice_flags", [])
    score = _score_submission(role, answer, flags)
    strengths = _build_strengths(role, answer)
    weaknesses = _build_weaknesses(answer, flags)
    recommendation = _recommendation_for_score(score)

    mock_response = {
        "overall_score": score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "hiring_recommendation": recommendation,
        "ai_feedback": (
            f"{name} scored {round(score / 10, 1)}/10 for the {role} task. "
            f"The submission shows {strengths[0].lower()}. "
            f"Primary improvement area: {weaknesses[0].lower()}."
        ),
        "plagiarism_score": 12.5,
        "originality_score": 87.5,
        "plagiarism_risk_level": "Medium" if flags else "Low",
        "ai_generated_suspicion": 15.0 + (10 * len(flags)),
        "authenticity_summary": _authenticity_summary(flags),
        "malpractice_flags": flags
    }
    
    return mock_response


def _score_submission(role: str, answer: str, flags: list) -> float:
    score = 50.0

    if len(answer) > 300:
        score += 12
    if len(answer) > 800:
        score += 8
    if any(term in answer for term in ["test", "tests", "pytest", "validation"]):
        score += 8
    if any(term in answer for term in ["error", "exception", "rollback", "try"]):
        score += 8
    if any(term in answer for term in ["database", "sql", "model", "schema"]):
        score += 6
    if any(term in answer for term in ["api", "endpoint", "fastapi", "route"]):
        score += 6
    if any(term in answer for term in ["security", "auth", "permission"]):
        score += 4

    if "frontend" in role.lower() and any(term in answer for term in ["react", "component", "state"]):
        score += 8
    if "data" in role.lower() and any(term in answer for term in ["metric", "trend", "insight"]):
        score += 8
    if "product" in role.lower() and any(term in answer for term in ["priority", "user", "impact"]):
        score += 8

    score -= min(len(flags) * 7, 21)

    if len(answer.strip()) < 80:
        score -= 18

    return round(max(0, min(score, 98)), 1)


def _build_strengths(role: str, answer: str) -> list:
    strengths = []

    if any(term in answer for term in ["api", "endpoint", "fastapi", "route"]):
        strengths.append("Clear API design")
    if any(term in answer for term in ["validation", "schema", "pydantic"]):
        strengths.append("Strong validation approach")
    if any(term in answer for term in ["error", "exception", "rollback"]):
        strengths.append("Good reliability and error handling")
    if "frontend" in role.lower() and "react" in answer:
        strengths.append("Relevant React implementation thinking")

    if not strengths:
        strengths.append("Understands the task objective")

    return strengths[:3]


def _build_weaknesses(answer: str, flags: list) -> list:
    weaknesses = []

    if not any(term in answer for term in ["test", "tests", "pytest"]):
        weaknesses.append("Needs stronger testing coverage")
    if not any(term in answer for term in ["error", "exception", "rollback"]):
        weaknesses.append("Could improve failure handling")
    if len(answer.strip()) < 300:
        weaknesses.append("Needs more implementation detail")
    if flags:
        weaknesses.append("Integrity warnings need recruiter review")

    return weaknesses[:3] or ["Could provide clearer trade-off reasoning"]


def _recommendation_for_score(score: float) -> str:
    if score >= 85:
        return "Strong Hire"
    if score >= 70:
        return "Hire"
    return "No Hire"


def _authenticity_summary(flags: list) -> str:
    if flags:
        return "Submission is technically reviewable, but proctoring flags should be checked before selection."

    return "The submission appears original with no significant proctoring concerns."
>>>>>>> origin/geshna-backend
