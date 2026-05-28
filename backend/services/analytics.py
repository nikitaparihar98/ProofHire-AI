import json
from typing import Dict, Any, List
from backend.models.models import Candidate
from sqlalchemy.orm import Session


def calculate_honesty_score(candidate: Candidate) -> float:
    """Calculate honesty score based on claimed vs demonstrated skills.
    Simple heuristic: average match percentage across overlapping skills.
    """
    claimed = candidate.claimed_skills_json or {}
    demonstrated = candidate.demonstrated_skills_json or {}
    if not claimed or not demonstrated:
        return 0.0
    total = 0.0
    count = 0
    for skill, claimed_level in claimed.items():
        demo_level = demonstrated.get(skill)
        if demo_level is None:
            continue
        # map levels to numeric scale (Beginner=1, Intermediate=2, Advanced=3, Expert=4)
        level_map = {"beginner": 1, "intermediate": 2, "advanced": 3, "expert": 4}
        c_val = level_map.get(claimed_level.lower(), 0)
        d_val = level_map.get(demo_level.lower(), 0)
        if c_val and d_val:
            match = 1 - abs(c_val - d_val) / 3  # max diff 3
            total += match
            count += 1
    return round((total / count) * 100, 2) if count else 0.0


def detect_skill_mismatch(candidate: Candidate) -> Dict[str, Any]:
    """Return a dict of skill mismatches with severity levels."""
    claimed = candidate.claimed_skills_json or {}
    demonstrated = candidate.demonstrated_skills_json or {}
    mismatches = {}
    level_map = {"beginner": 1, "intermediate": 2, "advanced": 3, "expert": 4}
    for skill, claimed_level in claimed.items():
        demo_level = demonstrated.get(skill)
        if demo_level:
            diff = level_map.get(claimed_level.lower(), 0) - level_map.get(demo_level.lower(), 0)
            if diff > 1:
                status = "overclaim"
            elif diff < -1:
                status = "underclaim"
            else:
                continue
            mismatches[skill] = {"claimed": claimed_level, "demonstrated": demo_level, "status": status}
    return mismatches


def detect_hidden_talents(candidate: Candidate) -> List[Dict[str, Any]]:
    """Identify skills demonstrated but not claimed."""
    claimed = set((candidate.claimed_skills_json or {}).keys())
    demonstrated = candidate.demonstrated_skills_json or {}
    hidden = []
    for skill, level in demonstrated.items():
        if skill not in claimed:
            hidden.append({"skill": skill, "level": level})
    return hidden

import logging


def extract_claimed_skills(candidate: Candidate) -> Dict[str, Any]:
    """Extract claimed skills safely as a dict."""
    return candidate.claimed_skills_json or {}


def extract_demonstrated_skills(candidate: Candidate) -> Dict[str, Any]:
    """Extract demonstrated skills safely as a dict."""
    return candidate.demonstrated_skills_json or {}


def calculate_overclaim_risk(candidate: Candidate) -> float:
    """Calculate overclaim risk percentage based on skill mismatches."""
    try:
        mismatches = detect_skill_mismatch(candidate)
        if not mismatches:
            return 0.0
        overclaims = [s for s, v in mismatches.items() if v.get("status") == "overclaim"]
        return round((len(overclaims) / len(mismatches)) * 100, 2)
    except Exception as e:
        logging.error(f"Overclaim risk calculation failed: {e}")
        return 0.0


def calculate_underclaim_score(candidate: Candidate) -> float:
    """Calculate underclaim score percentage based on skill mismatches."""
    try:
        mismatches = detect_skill_mismatch(candidate)
        if not mismatches:
            return 0.0
        underclaims = [s for s, v in mismatches.items() if v.get("status") == "underclaim"]
        return round((len(underclaims) / len(mismatches)) * 100, 2)
    except Exception as e:
        logging.error(f"Underclaim score calculation failed: {e}")
        return 0.0


def generate_growth_nudges(candidate: Candidate) -> List[Dict[str, Any]]:
    """Generate simple growth nudges for underperformed claimed skills."""
    try:
        claimed = candidate.claimed_skills_json or {}
        demonstrated = candidate.demonstrated_skills_json or {}
        level_order = {"beginner": 1, "intermediate": 2, "advanced": 3, "expert": 4}
        nudges = []
        for skill, claimed_lvl in claimed.items():
            demo_lvl = demonstrated.get(skill)
            if demo_lvl:
                c_val = level_order.get(claimed_lvl.lower(), 0)
                d_val = level_order.get(demo_lvl.lower(), 0)
                if d_val < c_val:
                    nudges.append({"skill": skill, "suggestion": f"Focus on improving from {demo_lvl} towards {claimed_lvl}"})
        return nudges
    except Exception as e:
        logging.error(f"Growth nudges generation failed: {e}")
        return []


def generate_red_flag_alerts(candidate: Candidate) -> List[Dict[str, Any]]:
    """Generate red‑flag alerts based on malpractice severity or high overclaim risk."""
    alerts = []
    try:
        if candidate.malpractice_severity and candidate.malpractice_severity > 70:
            alerts.append({"type": "malpractice", "severity": candidate.malpractice_severity})
        overclaim_risk = calculate_overclaim_risk(candidate)
        if overclaim_risk > 50:
            alerts.append({"type": "overclaim", "risk": overclaim_risk})
    except Exception as e:
        logging.error(f"Red flag alert generation failed: {e}")
    return alerts

# Extend update_candidate_analytics to persist new fields

def _update_additional_fields(cand: Candidate):
    """Populate new analytics columns safely."""
    try:
        cand.claimed_skills_analysis = extract_claimed_skills(cand)
    except Exception as e:
        logging.error(f"Failed to set claimed_skills_analysis: {e}")
    try:
        cand.demonstrated_skills = extract_demonstrated_skills(cand)
    except Exception as e:
        logging.error(f"Failed to set demonstrated_skills: {e}")
    try:
        cand.overclaim_risk_score = calculate_overclaim_risk(cand)
    except Exception as e:
        logging.error(f"Failed to set overclaim_risk_score: {e}")
    try:
        cand.underclaim_score = calculate_underclaim_score(cand)
    except Exception as e:
        logging.error(f"Failed to set underclaim_score: {e}")
    try:
        cand.growth_nudges = generate_growth_nudges(cand)
    except Exception as e:
        logging.error(f"Failed to set growth_nudges: {e}")
    try:
        cand.red_flag_alerts = generate_red_flag_alerts(cand)
    except Exception as e:
        logging.error(f"Failed to set red_flag_alerts: {e}")

# Inject call into update_candidate_analytics



def calculate_malpractice_severity(candidate: Candidate) -> float:
    """Aggregate malpractice flags into a severity score (0‑100)."""
    flags = candidate.malpractice_flags or []
    severity = 0.0
    # simple weighting scheme
    weight_map = {
        "tab_switching": 10,
        "copy_paste": 15,
        "ai_generated": 25,
        "plagiarism": 30,
        "webcam_incident": 20,
    }
    for flag in flags:
        severity += weight_map.get(flag.get("type"), 0)
    return min(severity, 100.0)


def calculate_ai_content_score(candidate: Candidate) -> float:
    """Return AI‑generated content suspicion score (0‑100)."""
    return round(candidate.ai_generated_suspicion * 100, 2)


def calculate_final_recruiter_score(candidate: Candidate) -> float:
    """Weighted aggregate score as specified in requirements."""
    tech = candidate.technical_score or 0.0
    honesty = candidate.honesty_score or 0.0
    comm = candidate.communication_score or 0.0
    prob = candidate.problem_solving_score or 0.0
    malpractice = candidate.malpractice_severity or 0.0
    final = (
        tech * 0.35 +
        honesty * 0.25 +
        comm * 0.15 +
        prob * 0.15 -
        malpractice * 0.10
    )
    return round(final, 2)


def generate_recruiter_summary(candidate: Candidate) -> str:
    """Compose a concise recruiter‑facing summary string."""
    parts = []
    # strengths / weaknesses already exist
    if candidate.strengths:
        parts.append(f"Strengths: {', '.join(candidate.strengths)}.")
    if candidate.weaknesses:
        parts.append(f"Weaknesses: {', '.join(candidate.weaknesses)}.")
    # honesty analysis
    if candidate.honesty_score:
        parts.append(f"Honesty score: {candidate.honesty_score}%.")
    # hidden talent
    hidden = candidate.hidden_talents or []
    if hidden:
        talent_list = ', '.join([t["skill"] for t in hidden])
        parts.append(f"Hidden talents identified: {talent_list}.")
    # malpractice
    if candidate.malpractice_severity and candidate.malpractice_severity > 20:
        parts.append(f"Malpractice severity: {candidate.malpractice_severity}/100 – {candidate.recruiter_risk_level} risk.")
    # recommendation
    rec = candidate.hiring_recommendation or "Pending"
    parts.append(f"Hiring recommendation: {rec}.")
    return " ".join(parts)

def update_candidate_analytics(db: Session, candidate_id: int) -> Candidate:
    """Run all analytics calculations and persist to DB for a given candidate."""
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise ValueError("Candidate not found")
    cand.honesty_score = calculate_honesty_score(cand)
    cand.skill_mismatch = detect_skill_mismatch(cand)
    cand.hidden_talents = detect_hidden_talents(cand)
    cand.malpractice_severity = calculate_malpractice_severity(cand)
    # set risk level based on severity thresholds
    if cand.malpractice_severity >= 75:
        cand.recruiter_risk_level = "Critical"
    elif cand.malpractice_severity >= 50:
        cand.recruiter_risk_level = "High"
    elif cand.malpractice_severity >= 25:
        cand.recruiter_risk_level = "Medium"
    else:
        cand.recruiter_risk_level = "Low"
    cand.ai_content_score = calculate_ai_content_score(cand)
    cand.plagiarism_score = cand.plagiarism_score  # already stored
    cand.final_recruiter_score = calculate_final_recruiter_score(cand)
    cand.recruiter_summary = generate_recruiter_summary(cand)
    _update_additional_fields(cand)
    db.commit()
    db.refresh(cand)
    return cand
