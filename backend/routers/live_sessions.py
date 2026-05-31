from fastapi import APIRouter, HTTPException, Depends
from backend.routers.live_ws import publish_event
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from datetime import datetime
import uuid
from backend.core.database import get_db
from backend.models import models
from backend.routers.notifications import create_notification
from backend.services.auth_service import get_current_user, require_recruiter

router = APIRouter(
    prefix="/api/live",
    tags=["live"]
)

# In-memory store for MVP. In production, use Redis or WebSockets + DB.
# Structure: { session_id: { candidate_name: str, role: str, status: str, started_at: str, events: list } }
active_sessions: Dict[str, Any] = {}

@router.post("/start")
def start_session(
    data: Dict[str, str],
    _user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session_id = str(uuid.uuid4())
    
    candidate_name = data.get("name", "Unknown")
    candidate_email = data.get("email")
    
    # 1. Update candidate status in DB if exists (prefer email)
    if candidate_email:
        candidate = db.query(models.Candidate).filter(models.Candidate.email == candidate_email).first()
    else:
        candidate = db.query(models.Candidate).filter(models.Candidate.name == candidate_name).first()
        
    if candidate:
        candidate.status = "Attending"
        db.commit()

    # 2. Create Notification
    create_notification(
        db, 
        "Assessment Started", 
        f"Candidate {candidate_name} has started the assessment.",
        "info"
    )

    active_sessions[session_id] = {
        "id": session_id,
        "candidate_name": data.get("name", "Unknown"),
        "role": data.get("role", "Unknown"),
        "status": "in_progress",
        "started_at": datetime.utcnow().isoformat(),
        "events": [],
        "risk_level": "Low",
        "malpractice_score": 0
    }
    return {"session_id": session_id}

@router.get("/active")
def get_active_sessions(_recruiter: models.User = Depends(require_recruiter)):
    return [session for session in active_sessions.values() if session["status"] == "in_progress"]

@router.get("/{session_id}")
def get_session(
    session_id: str,
    _recruiter: models.User = Depends(require_recruiter),
):
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return active_sessions[session_id]

@router.post("/{session_id}/event")
async def log_event(
    session_id: str,
    event: Dict[str, Any],
    _user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    e_type = event.get("type")
    e_severity = event.get("severity", "info")
    
    # Trigger critical notifications
    if e_severity in ["warning", "critical"]:
        create_notification(
            db,
            "Malpractice Warning",
            f"Candidate {active_sessions[session_id]['candidate_name']} triggered a {e_type} event.",
            e_severity
        )

    event_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "type": e_type,
        "message": event.get("message"),
        "severity": e_severity
    }
    
    active_sessions[session_id]["events"].append(event_data)
    
    # Smart AI Engine Scoring
    score_increment = 0
    if e_severity == "critical":
        score_increment = 40
        active_sessions[session_id]["malpractice_score"] += 40
    elif e_severity == "warning":
        score_increment = 15
        active_sessions[session_id]["malpractice_score"] += 15
        
    current_score = active_sessions[session_id]["malpractice_score"]
    
    # Dynamic severity mapping and Auto-disqualification
    auto_disqualified = False
    if current_score >= 100 and active_sessions[session_id]["status"] != "terminated":
        active_sessions[session_id]["risk_level"] = "High"
        active_sessions[session_id]["status"] = "terminated"
        auto_disqualified = True
        
        auto_disq_event = {
            "timestamp": datetime.utcnow().isoformat(),
            "type": "auto_disqualification",
            "message": f"Auto-disqualified due to severe malpractice (Score: {current_score}).",
            "severity": "critical"
        }
        active_sessions[session_id]["events"].append(auto_disq_event)
        
        # Critical Alert to Recruiter
        create_notification(
            db,
            "Candidate Auto-Disqualified",
            f"Candidate {active_sessions[session_id]['candidate_name']} has been auto-disqualified (Score: {current_score}).",
            "critical"
        )
        
        # Sync rejection to the database
        candidate_name = active_sessions[session_id]["candidate_name"]
        candidate = db.query(models.Candidate).filter(models.Candidate.name == candidate_name).first()
        if candidate:
            candidate.status = "Rejected"
            candidate.hiring_recommendation = "No Hire"
            candidate.rejection_reason = f"Auto-disqualified due to severe malpractice (Score: {current_score})."
            db.commit()
            
    elif current_score >= 70:
        active_sessions[session_id]["risk_level"] = "High"
    elif current_score >= 30:
        active_sessions[session_id]["risk_level"] = "Medium"
    else:
        active_sessions[session_id]["risk_level"] = "Low"
    
    # Broadcast via WebSocket
    await publish_event(
        session_id=session_id,
        event_type=e_type,
        message=event.get("message"),
        severity=active_sessions[session_id]["risk_level"],
        event_score=score_increment,
        cumulative_score=current_score,
        candidate_id=active_sessions[session_id].get("candidate_id", "unknown"),
        auto_disqualified=auto_disqualified,
    )
        
    return {"status": "success"}

@router.post("/{session_id}/complete")
def complete_session(
    session_id: str,
    _user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    active_sessions[session_id]["status"] = "completed"
    
    create_notification(
        db,
        "Assessment Completed",
        f"Candidate {active_sessions[session_id]['candidate_name']} finished their session.",
        "success"
    )

    # Extract accumulated malpractice flags to return them so the frontend can send them to POST /api/evaluate
    flags = [e["message"] for e in active_sessions[session_id]["events"] if e["severity"] in ["warning", "critical"]]
    
    return {"status": "success", "malpractice_flags": flags}

@router.patch("/{session_id}/validate")
def validate_session(
    session_id: str,
    _recruiter: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    active_sessions[session_id]["risk_level"] = "Verified"
    active_sessions[session_id]["events"].append({
        "timestamp": datetime.utcnow().isoformat(),
        "type": "recruiter_intervention",
        "message": "Recruiter manually marked session as valid.",
        "severity": "info"
    })
    
    create_notification(
        db,
        "Session Verified",
        f"Recruiter verified the session for {active_sessions[session_id]['candidate_name']}.",
        "success"
    )
    
    return {"status": "success"}

@router.patch("/{session_id}/terminate")
def terminate_session(
    session_id: str,
    _recruiter: models.User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    active_sessions[session_id]["status"] = "terminated"
    active_sessions[session_id]["events"].append({
        "timestamp": datetime.utcnow().isoformat(),
        "type": "recruiter_intervention",
        "message": "Recruiter terminated the assessment.",
        "severity": "critical"
    })
    
    create_notification(
        db,
        "Session Terminated",
        f"Recruiter terminated the assessment for {active_sessions[session_id]['candidate_name']}.",
        "warning"
    )
    
    return {"status": "success"}
