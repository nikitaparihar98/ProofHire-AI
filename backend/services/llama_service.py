from typing import Dict, Any, List

def evaluate_candidate_mock(
    name: str,
    role: str,
    submission_data: Dict[str, Any],
    resume_skills: Dict[str, str] = None
) -> Dict[str, Any]:
    """
    Mock function to simulate calling the Llama API for candidate evaluation.
    In a real scenario, this would send submission_data to Llama API
    and parse the JSON response.
    Now extended to dynamically compare claimed resume_skills with task reality.
    """
    
    answer = str(submission_data.get("answer", "")).lower()
    flags = submission_data.get("live_malpractice_flags", [])
    score = _score_submission(role, answer, flags)
    strengths = _build_strengths(role, answer)
    weaknesses = _build_weaknesses(answer, flags)
    recommendation = _recommendation_for_score(score)

    # 1. Fallback / Default resume skills if none uploaded
    if not resume_skills:
        if "backend" in role.lower():
            resume_skills = {"SQL": "Advanced", "FastAPI": "Intermediate", "Python": "Advanced"}
        elif "frontend" in role.lower():
            resume_skills = {"React": "Advanced", "CSS": "Intermediate", "JavaScript": "Advanced"}
        else:
            resume_skills = {"Problem Solving": "Advanced", "System Design": "Intermediate"}

    # 2. Dynamic skill verification
    level_map = {"Junior": 1, "Intermediate": 2, "Advanced": 3}
    proven_skills = {}
    gaps = []
    nudges = []
    total_penalty = 0.0

    for skill, claimed_level in resume_skills.items():
        proven_level = _evaluate_proven_level(skill, answer, score)
        proven_skills[skill] = proven_level

        claimed_val = level_map.get(claimed_level, 2)
        proven_val = level_map.get(proven_level, 2)

        if claimed_val == proven_val:
            # Perfect alignment
            pass
        elif claimed_val > proven_val:
            # Overclaim
            diff = claimed_val - proven_val
            penalty = diff * 20.0
            total_penalty += penalty
            gaps.append(f"Overclaim in {skill}: Claimed {claimed_level}, Proven {proven_level}")
            
            if skill.lower() == "sql":
                nudges.append("To match your Advanced SQL claim, focus on query execution plans (EXPLAIN), indexes, and transaction safety in your database queries.")
            elif "react" in skill.lower():
                nudges.append("To match your Advanced React claim, practice optimized rendering (memo, callbacks) and robust state handling.")
            else:
                nudges.append(f"To match your {claimed_level} {skill} claim, focus on implementing edge cases, unit tests, and structural safety.")
        else:
            # Underclaim -> Hidden Talent!
            gaps.append(f"Underclaim in {skill} (Hidden Talent!): Claimed {claimed_level}, Proven {proven_level}")
            nudges.append(f"Hidden Talent nudge: You proved {proven_level} level in {skill}, but only claimed {claimed_level}. Great job underselling and overdelivering!")

    skill_authenticity_score = max(0.0, 100.0 - total_penalty)

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
        "malpractice_flags": flags,
        
        # New resume vs proof columns
        "resume_skills": resume_skills,
        "proven_skills": proven_skills,
        "skill_authenticity_score": round(skill_authenticity_score, 1),
        "authenticity_gaps": gaps,
        "growth_nudges": nudges
    }
    
    return mock_response


def _evaluate_proven_level(skill: str, answer: str, overall_score: float) -> str:
    skill_lower = skill.lower()
    answer_lower = answer.lower()
    
    if "sql" in skill_lower:
        if any(term in answer_lower for term in ["explain", "index", "transaction", "rollback", "optimization"]):
            return "Advanced"
        elif any(term in answer_lower for term in ["select", "join", "where", "insert", "db"]):
            return "Intermediate"
        return "Junior"
    elif "react" in skill_lower or "frontend" in skill_lower:
        if any(term in answer_lower for term in ["usecontext", "redux", "memo", "callback", "custom hook"]):
            return "Advanced"
        elif any(term in answer_lower for term in ["usestate", "useeffect", "component", "props"]):
            return "Intermediate"
        return "Junior"
    elif "fastapi" in skill_lower or "python" in skill_lower or "backend" in skill_lower:
        if any(term in answer_lower for term in ["depends", "apirouter", "middleware", "asyncio", "background"]):
            return "Advanced"
        elif any(term in answer_lower for term in ["def", "import", "class", "router", "endpoint"]):
            return "Intermediate"
        return "Junior"
    
    # Fallback to overall score mapping
    if overall_score >= 85:
        return "Advanced"
    elif overall_score >= 70:
        return "Intermediate"
    else:
        return "Junior"


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
    if "full stack" in role.lower() and any(term in answer for term in ["frontend", "backend", "api", "database"]):
        score += 8
    if "backend" in role.lower() and any(term in answer for term in ["auth", "transaction", "endpoint", "database"]):
        score += 8
    if "data" in role.lower() and any(term in answer for term in ["metric", "trend", "insight"]):
        score += 8
    if any(term in role.lower() for term in ["ai/ml", "machine learning", "ml engineer"]) and any(term in answer for term in ["model", "evaluation", "bias", "experiment"]):
        score += 8
    if any(term in role.lower() for term in ["ui/ux", "designer"]) and any(term in answer for term in ["accessibility", "journey", "prototype", "user"]):
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
    if "backend" in role.lower() and any(term in answer for term in ["auth", "database", "endpoint"]):
        strengths.append("Relevant backend architecture thinking")
    if "data" in role.lower() and any(term in answer for term in ["metric", "insight", "sql"]):
        strengths.append("Strong analytical framing")
    if any(term in role.lower() for term in ["ai/ml", "machine learning"]) and any(term in answer for term in ["model", "evaluation", "bias"]):
        strengths.append("Thoughtful model evaluation approach")
    if any(term in role.lower() for term in ["ui/ux", "designer"]) and any(term in answer for term in ["accessibility", "user", "journey"]):
        strengths.append("User-centered design reasoning")

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
