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
