from typing import List

from fastapi import APIRouter

from backend.schemas import schemas
from backend.services.task_service import assign_task_for_role, get_all_tasks, get_tasks_for_role

router = APIRouter(
    prefix="/api/tasks",
    tags=["tasks"],
)


@router.get("/", response_model=List[schemas.TaskResponse])
def list_tasks():
    """Return the available real-world assessment tasks."""
    return get_all_tasks()


@router.get("/{role}", response_model=List[schemas.TaskResponse])
def list_tasks_for_role(role: str):
    """Return tasks that match a candidate role."""
    return get_tasks_for_role(role)


@router.post("/assign", response_model=schemas.TaskResponse)
def assign_task(request: schemas.TaskAssignRequest):
    """Assign one recommended task for a candidate role."""
    return assign_task_for_role(request.role)

@router.post("/generate-ai")
def generate_ai_task(request: schemas.TaskGenerateRequest):
    """Generate a custom task using AI based on role, difficulty and tech stack."""
    role = request.role
    difficulty = request.difficulty
    tech_stack = request.tech_stack
    
    title = f"{difficulty} {role} Core Assessment"
    prompt = (
        f"Create a fully-functioning API endpoint or component representing the core logic of a {role} "
        f"using {tech_stack}. The assignment must follow {difficulty}-level architecture rules. "
        f"You must include input validation, database state modeling, proper serialization, and "
        f"unit tests demonstrating correctness under boundary conditions."
    )
    focus = [f"{tech_stack} Best Practices", f"{difficulty}-level Architecture", "Error Handling & Edge Cases"]
    skills = [tech_stack, "REST API", "Testing"]
    
    if "frontend" in role.lower():
        title = f"Interactive {difficulty} {role} Challenge"
        prompt = (
            f"Build a responsive and highly polished user interface widget using {tech_stack} for a "
            f"modern Dashboard module. Focus heavily on clean state cycles, responsive styling grid, "
            f"and robust error state handling. Do not use generic placeholders; verify form validation is mock-tested."
        )
        focus = ["State Lifecycle", "Aesthetics & UX Precision", "Form & Data Validation"]
        skills = [tech_stack, "CSS Grid", "State Management"]
        
    return {
        "title": title,
        "prompt": prompt,
        "evaluation_focus": focus,
        "expected_skills": skills,
        "time_limit_minutes": 60 if difficulty == "Easy" else 90 if difficulty == "Medium" else 120
    }

