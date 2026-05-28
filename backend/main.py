from fastapi import FastAPI
from backend.routers import live_ws, candidates, live_sessions, notifications, auth, analytics, evaluate, interviews, submissions, tasks, messages, candidate_portal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ProofHire AI Backend",
    description="Live malpractice monitoring and candidate management",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with their own prefixes (they already define /api/...)
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
app.include_router(candidate_portal.router)

# Simple health‑check (no /api prefix)
@app.get("/health")
async def health_check():
    return {"status": "ok"}