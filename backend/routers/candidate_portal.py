from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models import models
from backend.schemas import schemas
from backend.services.auth_service import get_current_user, require_role
from backend.services.submission_service import evaluate_and_store_submission
from backend.services.task_service import assign_task_for_role, get_task_by_id
from backend.routers.notifications import create_notification

router = APIRouter(
    prefix="/api/candidate/me",
    tags=["candidate-portal"],
)


@router.get("/dashboard", response_model=schemas.CandidateDashboardResponse)
def get_candidate_dashboard(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(current_user, "candidate")
    candidate = _get_candidate_for_user(current_user, db)
    assignment = _get_or_create_assignment(candidate, db)

    if assignment.custom_title or assignment.custom_prompt:
        assigned_task = {
            "id": assignment.task_id or "custom",
            "role": candidate.role or "Candidate",
            "title": assignment.custom_title or "Custom Task",
            "task_type": "coding",
            "prompt": assignment.custom_prompt or "",
            "evaluation_focus": ["Recruiter Requirements", "Task Completion"],
            "time_limit_minutes": assignment.duration or 60,
        }
    else:
        assigned_task = get_task_by_id(assignment.task_id)

    return {
        "user": current_user,
        "candidate": candidate,
        "assigned_task": assigned_task,
        "assignment_id": assignment.id,
        "submission_status": assignment.status,
    }


@router.post("/submit", response_model=schemas.SubmissionResponse)
def submit_candidate_assessment(
    request: schemas.CandidateSelfSubmitRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(current_user, "candidate")
    candidate = _get_candidate_for_user(current_user, db)
    assignment = _get_or_create_assignment(candidate, db)

    if not request.answer.strip():
        raise HTTPException(status_code=422, detail="Answer is required")

    task = get_task_by_id(assignment.task_id)
    submission_data = {
        "task_id": task["id"],
        "task_title": task["title"],
        "answer": request.answer,
        "resume_score": request.resume_score,
        "completion_time": request.completion_time,
        "live_malpractice_flags": request.live_malpractice_flags or [],
    }

    evaluated_candidate = evaluate_and_store_submission(
        db=db,
        name=candidate.name,
        email=candidate.email,
        role=candidate.role,
        submission_data=submission_data,
    )

    assignment.status = "Evaluated"
    assignment.submitted_at = datetime.utcnow().isoformat()
    db.commit()

    return {
        "message": "Submission evaluated successfully",
        "candidate": evaluated_candidate,
    }


def _get_candidate_for_user(current_user: models.User, db: Session) -> models.Candidate:
    if not current_user.candidate_id:
        raise HTTPException(status_code=404, detail="Candidate profile not linked")

    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == current_user.candidate_id
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    return candidate


def _get_or_create_assignment(
    candidate: models.Candidate,
    db: Session,
) -> models.TaskAssignment:
    assignment = db.query(models.TaskAssignment).filter(
        models.TaskAssignment.candidate_id == candidate.id
    ).order_by(models.TaskAssignment.id.desc()).first()

    if assignment:
        return assignment

    task = assign_task_for_role(candidate.role)
    assignment = models.TaskAssignment(
        candidate_id=candidate.id,
        task_id=task["id"],
        status="Assigned",
        assigned_at=datetime.utcnow().isoformat(),
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.post("/resume", response_model=schemas.CandidateResponse)
def upload_candidate_resume(
    request: schemas.ResumeSkillsUploadRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(current_user, "candidate")
    candidate = _get_candidate_for_user(current_user, db)
    
    # Store resume_skills
    candidate.resume_skills = request.resume_skills
    
    # If the candidate has already submitted their assessment, let's trigger a re-evaluation
    # so that their authenticity score and gaps are updated instantly!
    has_answer = False
    if candidate.submission_data:
        import json
        sub_dict = candidate.submission_data
        if isinstance(sub_dict, str):
            try:
                sub_dict = json.loads(sub_dict)
            except Exception:
                sub_dict = {}
        if isinstance(sub_dict, dict) and sub_dict.get("answer"):
            has_answer = True

    if has_answer:
        from backend.services.llama_service import evaluate_candidate_mock
        # Convert string to dict if needed for evaluator call
        sub_dict = candidate.submission_data
        if isinstance(sub_dict, str):
            try:
                sub_dict = json.loads(sub_dict)
            except Exception:
                sub_dict = {}
                
        ai_result = evaluate_candidate_mock(
            name=candidate.name,
            role=candidate.role,
            submission_data=sub_dict,
            resume_skills=candidate.resume_skills,
        )
        candidate.resume_skills = ai_result.get("resume_skills", {})
        candidate.proven_skills = ai_result.get("proven_skills", {})
        candidate.skill_authenticity_score = ai_result.get("skill_authenticity_score", 0.0)
        candidate.authenticity_gaps = ai_result.get("authenticity_gaps", [])
        candidate.growth_nudges = ai_result.get("growth_nudges", [])

    db.commit()
    db.refresh(candidate)
    return candidate


# ---------------------------------------------------------------------------
# Candidate Assessments Router (Issue 2)
# ---------------------------------------------------------------------------
from typing import List, Any

assessments_router = APIRouter(
    prefix="/api/candidate/assessments",
    tags=["candidate-assessments"],
)

@assessments_router.get("/", response_model=List[Any])
def get_candidate_assessments(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(current_user, "candidate")
    candidate = _get_candidate_for_user(current_user, db)
    assignments = db.query(models.TaskAssignment).filter(
        models.TaskAssignment.candidate_id == candidate.id
    ).order_by(models.TaskAssignment.id.desc()).all()
    
    results = []
    for assignment in assignments:
        if assignment.custom_title or assignment.custom_prompt:
            task_details = {
                "id": assignment.task_id or "custom",
                "role": candidate.role,
                "title": assignment.custom_title or "Custom Task",
                "task_type": "coding",
                "prompt": assignment.custom_prompt or "",
                "evaluation_focus": ["Recruiter Requirements"],
                "time_limit_minutes": assignment.duration or 60,
            }
        else:
            task_details = get_task_by_id(assignment.task_id)
            
        results.append({
            "id": assignment.id,
            "candidate_id": assignment.candidate_id,
            "task_id": assignment.task_id,
            "status": assignment.status,
            "difficulty": assignment.difficulty,
            "duration": assignment.duration,
            "custom_prompt": assignment.custom_prompt,
            "custom_title": assignment.custom_title,
            "draft_answer": assignment.draft_answer,
            "time_left_seconds": assignment.time_left_seconds,
            "assigned_at": assignment.assigned_at,
            "submitted_at": assignment.submitted_at,
            "task": task_details,
            "candidate": {
                "id": candidate.id,
                "name": candidate.name,
                "role": candidate.role,
                "status": candidate.status,
                "overall_score": candidate.overall_score,
            }
        })
    return results

@assessments_router.get("/{id}")
def get_candidate_assessment_by_id(
    id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(current_user, "candidate")
    candidate = _get_candidate_for_user(current_user, db)
    assignment = db.query(models.TaskAssignment).filter(
        models.TaskAssignment.id == id,
        models.TaskAssignment.candidate_id == candidate.id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    if assignment.custom_title or assignment.custom_prompt:
        task_details = {
            "id": assignment.task_id or "custom",
            "role": candidate.role,
            "title": assignment.custom_title or "Custom Task",
            "task_type": "coding",
            "prompt": assignment.custom_prompt or "",
            "evaluation_focus": ["Recruiter Requirements"],
            "time_limit_minutes": assignment.duration or 60,
        }
    else:
        task_details = get_task_by_id(assignment.task_id)
        
    return {
        "id": assignment.id,
        "candidate_id": assignment.candidate_id,
        "task_id": assignment.task_id,
        "status": assignment.status,
        "difficulty": assignment.difficulty,
        "duration": assignment.duration,
        "custom_prompt": assignment.custom_prompt,
        "custom_title": assignment.custom_title,
        "draft_answer": assignment.draft_answer,
        "time_left_seconds": assignment.time_left_seconds,
        "assigned_at": assignment.assigned_at,
        "submitted_at": assignment.submitted_at,
        "task": task_details,
        "candidate": {
            "id": candidate.id,
            "name": candidate.name,
            "role": candidate.role,
            "status": candidate.status,
            "overall_score": candidate.overall_score,
            "strengths": candidate.strengths,
            "weaknesses": candidate.weaknesses,
            "ai_feedback": candidate.ai_feedback,
            "technical_score": candidate.technical_score,
            "communication_score": candidate.communication_score,
            "problem_solving_score": candidate.problem_solving_score,
            "recruiter_summary": candidate.recruiter_summary,
        }
    }

@assessments_router.post("/{id}/save")
def save_candidate_assessment_draft(
    id: int,
    request: schemas.SaveDraftRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(current_user, "candidate")
    candidate = _get_candidate_for_user(current_user, db)
    assignment = db.query(models.TaskAssignment).filter(
        models.TaskAssignment.id == id,
        models.TaskAssignment.candidate_id == candidate.id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    assignment.draft_answer = request.draft_answer
    assignment.time_left_seconds = request.time_left_seconds
    assignment.status = "IN_PROGRESS"
    if request.malpractice_log:
        assignment.malpractice_log = request.malpractice_log
        
    db.commit()
    return {"message": "Draft saved successfully"}

@assessments_router.post("/{id}/submit")
def submit_candidate_assessment(
    id: int,
    request: schemas.AssessmentSubmitRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(current_user, "candidate")
    candidate = _get_candidate_for_user(current_user, db)
    assignment = db.query(models.TaskAssignment).filter(
        models.TaskAssignment.id == id,
        models.TaskAssignment.candidate_id == candidate.id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    malpractice_flags = _merge_malpractice_logs(
        assignment.malpractice_log,
        request.malpractice_log,
    )

    task_title = assignment.custom_title or (get_task_by_id(assignment.task_id).get("title") if assignment.task_id else "Assessment")
    submission_data = {
        "task_id": assignment.task_id or "custom",
        "task_title": task_title,
        "answer": request.final_answer,
        "resume_score": 80.0,
        "completion_time": "Completed",
        "live_malpractice_flags": malpractice_flags,
    }
    
    from backend.services.llama_service import evaluate_candidate_mock
    ai_result = evaluate_candidate_mock(
        name=candidate.name,
        role=candidate.role,
        submission_data=submission_data,
        resume_skills=candidate.resume_skills,
    )
    
    candidate.overall_score = ai_result.get("overall_score", 0.0)
    candidate.strengths = ai_result.get("strengths", [])
    candidate.weaknesses = ai_result.get("weaknesses", [])
    candidate.hiring_recommendation = ai_result.get("hiring_recommendation", "Pending")
    candidate.ai_feedback = ai_result.get("ai_feedback", "")
    candidate.submission_data = submission_data
    candidate.plagiarism_score = ai_result.get("plagiarism_score", 0.0)
    candidate.originality_score = ai_result.get("originality_score", 100.0)
    candidate.plagiarism_risk_level = ai_result.get("plagiarism_risk_level", "Low")
    candidate.ai_generated_suspicion = ai_result.get("ai_generated_suspicion", 0.0)
    candidate.authenticity_summary = ai_result.get("authenticity_summary", "")
    candidate.malpractice_flags = ai_result.get("malpractice_flags", malpractice_flags)
    candidate.malpractice_severity = min(len(candidate.malpractice_flags or []) * 20, 100)
    candidate.status = "Evaluated"
    
    # Save resume claims vs proof columns
    candidate.resume_skills = ai_result.get("resume_skills", {})
    candidate.proven_skills = ai_result.get("proven_skills", {})
    candidate.skill_authenticity_score = ai_result.get("skill_authenticity_score", 0.0)
    candidate.authenticity_gaps = ai_result.get("authenticity_gaps", [])
    candidate.growth_nudges = ai_result.get("growth_nudges", [])
    
    # Structured breakdown scores
    candidate.technical_score = round(candidate.overall_score * 0.95, 1)
    candidate.communication_score = round(candidate.overall_score * 0.92, 1)
    candidate.problem_solving_score = round(candidate.overall_score * 0.97, 1)
    candidate.recruiter_summary = (
        f"Automated AI Evaluation for {candidate.name} in role {candidate.role}.\n"
        f"Key Strengths: {', '.join(candidate.strengths)}.\n"
        f"Areas of improvement: {', '.join(candidate.weaknesses)}.\n"
        f"Overall Recommendation: {candidate.hiring_recommendation}."
    )
    
    assignment.draft_answer = request.final_answer
    assignment.malpractice_log = malpractice_flags
    assignment.status = "Evaluated"
    import datetime
    assignment.submitted_at = datetime.datetime.utcnow().isoformat()
    
    db.commit()
    db.refresh(candidate)
    db.refresh(assignment)

    if candidate.malpractice_flags:
        create_notification(
            db,
            "Malpractice Warning",
            f"{candidate.name} submitted an assessment with {len(candidate.malpractice_flags)} proctoring flag(s).",
            "critical" if candidate.malpractice_severity >= 60 else "warning",
        )
    
    return {
        "message": "Assessment submitted and evaluated successfully",
        "candidate_id": candidate.id,
        "assignment_id": assignment.id,
    }


def _merge_malpractice_logs(*logs):
    merged = []
    seen = set()

    for log in logs:
        if not log:
            continue
        items = log if isinstance(log, list) else [log]
        for item in items:
            text = item.get("message") if isinstance(item, dict) else str(item)
            text = text.strip()
            if text and text not in seen:
                merged.append(text)
                seen.add(text)

    return merged

