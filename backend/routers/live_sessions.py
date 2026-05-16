from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from datetime import datetime
import uuid
from core.database import get_db
from models import models
from routers.notifications import create_notification

router = APIRouter(
    prefix="/api/live",
    tags=["live"]
)

# In-memory store for MVP. In production, use Redis or WebSockets + DB.
# Structure: { session_id: { candidate_name: str, role: str, status: str, started_at: str, events: list } }
active_sessions: Dict[str, Any] = {}

@router.post("/start")
def start_session(data: Dict[str, str], db: Session = Depends(get_db)):
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
        "risk_level": "Low"
    }
    return {"session_id": session_id}

@router.get("/active")
def get_active_sessions():
    return [session for session in active_sessions.values() if session["status"] == "in_progress"]

@router.get("/{session_id}")
def get_session(session_id: str):
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return active_sessions[session_id]

@router.post("/{session_id}/event")
def log_event(session_id: str, event: Dict[str, Any], db: Session = Depends(get_db)):
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
    
    # Update risk level based on events
    critical_events = sum(1 for e in active_sessions[session_id]["events"] if e["severity"] == "critical")
    warning_events = sum(1 for e in active_sessions[session_id]["events"] if e["severity"] == "warning")
    
    if critical_events > 0 or warning_events > 3:
        active_sessions[session_id]["risk_level"] = "High"
    elif warning_events > 0:
        active_sessions[session_id]["risk_level"] = "Medium"
        
    return {"status": "success"}

@router.post("/{session_id}/complete")
def complete_session(session_id: str, db: Session = Depends(get_db)):
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
def validate_session(session_id: str, db: Session = Depends(get_db)):
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
def terminate_session(session_id: str, db: Session = Depends(get_db)):
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
