from typing import Dict, List


TASK_BANK: List[Dict] = [
    {
        "id": "backend-api-001",
        "role": "Backend Developer",
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
        "id": "backend-auth-002",
        "role": "Backend Developer",
        "title": "Design Authenticated Recruiter Endpoints",
        "task_type": "system-design",
        "prompt": (
            "Design protected API routes for recruiters to list candidates, review reports, "
            "and update decisions. Include token validation, role checks, and database error handling."
        ),
        "evaluation_focus": [
            "authentication",
            "authorization",
            "API contracts",
            "database transactions",
            "failure handling",
        ],
        "time_limit_minutes": 75,
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
        "id": "fullstack-workflow-001",
        "role": "Full Stack Developer",
        "title": "Implement an End-to-End Assessment Flow",
        "task_type": "coding",
        "prompt": (
            "Build a small full-stack workflow where a candidate receives an assessment, "
            "submits an answer, and a recruiter can view the evaluated result."
        ),
        "evaluation_focus": [
            "frontend state",
            "backend API design",
            "database persistence",
            "auth-aware UX",
            "integration quality",
        ],
        "time_limit_minutes": 90,
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
        "id": "aiml-eval-001",
        "role": "AI/ML Engineer",
        "title": "Evaluate an AI Screening Model",
        "task_type": "analysis",
        "prompt": (
            "Given a model used to screen candidates, identify useful evaluation metrics, "
            "fairness risks, failure cases, and an experiment plan to improve reliability."
        ),
        "evaluation_focus": [
            "model evaluation",
            "bias and fairness",
            "experiment design",
            "technical depth",
            "communication",
        ],
        "time_limit_minutes": 75,
    },
    {
        "id": "uiux-design-001",
        "role": "UI/UX Designer",
        "title": "Design a Candidate Assessment Experience",
        "task_type": "design",
        "prompt": (
            "Propose a candidate assessment flow that reduces anxiety while preserving test integrity. "
            "Describe screens, interaction states, accessibility considerations, and success metrics."
        ),
        "evaluation_focus": [
            "user empathy",
            "interaction design",
            "accessibility",
            "trade-off reasoning",
            "measurement",
        ],
        "time_limit_minutes": 60,
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
    # Accept roles with dashes as substitute for slashes
    normalized_role = role.replace("-", "/").strip().lower()

    aliases = {
        "backend engineer": "backend developer",
        "frontend engineer": "frontend developer",
        "machine learning engineer": "ai/ml engineer",
        "ml engineer": "ai/ml engineer",
    }

    normalized_role = aliases.get(normalized_role, normalized_role)

    matching_tasks = [
        task for task in TASK_BANK
        if task["role"].lower() == normalized_role
    ]

    return matching_tasks


def get_task_by_id(task_id: str) -> Dict:
    for task in TASK_BANK:
        if task["id"] == task_id:
            return task

    return TASK_BANK[0]
def assign_task_for_role(role: str) -> Dict:
    tasks = get_tasks_for_role(role)

    if tasks:
        return tasks[0]

    return TASK_BANK[0]