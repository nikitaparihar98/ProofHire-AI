from typing import Dict, List


TASK_BANK: List[Dict] = [
    {
        "id": "backend-api-001",
        "role": "Backend Engineer",
        "title": "Build a Candidate Submission API",
        "task_type": "coding",
        "prompt": (
            "Design a FastAPI endpoint that accepts a candidate assignment submission, "
            "validates required fields, stores the result, and returns a clean response."
        ),
        "evaluation_focus": [
            "API design",
            "validation",
            "database reliability",
            "error handling",
            "response clarity",
        ],
        "time_limit_minutes": 60,
    },
    {
        "id": "frontend-ui-001",
        "role": "Frontend Developer",
        "title": "Create a Candidate Skill Report View",
        "task_type": "coding",
        "prompt": (
            "Build a React component that displays a candidate score, strengths, "
            "weaknesses, and a final recommendation using data from an API response."
        ),
        "evaluation_focus": [
            "component structure",
            "state handling",
            "responsive UI",
            "data rendering",
        ],
        "time_limit_minutes": 60,
    },
    {
        "id": "data-analyst-001",
        "role": "Data Analyst",
        "title": "Analyze Hiring Funnel Drop-Off",
        "task_type": "data",
        "prompt": (
            "Given candidate funnel data, identify the largest drop-off stage, "
            "explain the likely cause, and recommend one measurable improvement."
        ),
        "evaluation_focus": [
            "data interpretation",
            "structured reasoning",
            "business impact",
            "recommendation quality",
        ],
        "time_limit_minutes": 45,
    },
    {
        "id": "product-manager-001",
        "role": "Product Manager",
        "title": "Prioritize Recruiter Dashboard Improvements",
        "task_type": "case",
        "prompt": (
            "Prioritize three improvements for a recruiter dashboard. Explain the "
            "user problem, trade-offs, and success metric for each improvement."
        ),
        "evaluation_focus": [
            "product thinking",
            "prioritization",
            "trade-off clarity",
            "metric selection",
        ],
        "time_limit_minutes": 45,
    },
]


def get_all_tasks() -> List[Dict]:
    return TASK_BANK


def get_tasks_for_role(role: str) -> List[Dict]:
    normalized_role = role.strip().lower()
    matching_tasks = [
        task for task in TASK_BANK
        if task["role"].lower() == normalized_role
    ]

    if matching_tasks:
        return matching_tasks

    return [TASK_BANK[0]]


def assign_task_for_role(role: str) -> Dict:
    return get_tasks_for_role(role)[0]


def get_task_by_id(task_id: str) -> Dict:
    for task in TASK_BANK:
        if task["id"] == task_id:
            return task

    return TASK_BANK[0]
