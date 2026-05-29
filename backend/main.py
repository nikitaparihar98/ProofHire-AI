from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import (
    live_ws,
    candidates,
    live_sessions,
    notifications,
    auth,
    analytics,
    evaluate,
    interviews,
    submissions,
    tasks,
    messages,
    candidate_portal,
    candidate_profile,
)


app = FastAPI(
    title="ProofHire AI Backend",
    description="Live malpractice monitoring and candidate management",
)

# Allow the frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):517[0-9]",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers (they already have /api prefixes)
app.include_router(live_ws.router)
app.include_router(candidates.router)
app.include_router(live_sessions.router)
app.include_router(notifications.router)
app.include_router(auth.router)
app.include_router(analytics.router)
app.include_router(evaluate.router)
app.include_router(interviews.router)
app.include_router(submissions.router)
app.include_router(tasks.router)
app.include_router(messages.router)
from backend.routers.candidate_portal import router as candidate_portal_router, assessments_router
app.include_router(candidate_portal_router)
app.include_router(assessments_router)
app.include_router(candidate_profile.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
