# ProofHire AI Backend API

Backend base URL for local development:

```txt
http://127.0.0.1:8080
```

Frontend API base URL:

```txt
http://127.0.0.1:8080/api
```

## Demo Flow

```txt
1. User signs up or logs in as recruiter/candidate
2. Candidate opens their dashboard and receives assigned task
3. Candidate submits answer
4. Backend evaluates and stores result
5. Recruiter views ranked results
6. Recruiter opens decision insights
7. Recruiter compares candidates
```

## Health Check

### `GET /health`

Checks whether the backend is running.

Response:

```json
{
  "status": "ok"
}
```

## Task Assignment

For the final candidate flow, prefer `GET /api/candidate/me/dashboard` because it returns the candidate's persisted assigned task. The task endpoints below are still useful for recruiter/admin previews and frontend testing.

### `GET /api/tasks/`

Returns all available assessment tasks.

### `GET /api/tasks/{role}`

Returns tasks matching a role.

Example:

```txt
GET /api/tasks/Backend%20Engineer
```

### `POST /api/tasks/assign`

Assigns one recommended task for a candidate role.

Request:

```json
{
  "role": "Backend Engineer"
}
```

Response:

```json
{
  "id": "backend-api-001",
  "role": "Backend Engineer",
  "title": "Build a Candidate Submission API",
  "task_type": "coding",
  "prompt": "Design a FastAPI endpoint that accepts a candidate assignment submission, validates required fields, stores the result, and returns a clean response.",
  "evaluation_focus": [
    "API design",
    "validation",
    "database reliability",
    "error handling",
    "response clarity"
  ],
  "time_limit_minutes": 60
}
```

## Submit Assessment

### `POST /api/submit`

Submits a candidate answer, runs evaluation, stores the result, and returns the evaluated candidate.

Request:

```json
{
  "name": "Asha Rao",
  "email": "asha@example.com",
  "role": "Backend Engineer",
  "submission_data": {
    "task_id": "backend-api-001",
    "resume_score": 42,
    "answer": "I would build a FastAPI endpoint with Pydantic validation, database schema, rollback on exception, tests with pytest, clear response models, and reliable error handling.",
    "completion_time": "42 mins",
    "live_malpractice_flags": []
  }
}
```

Response:

```json
{
  "message": "Submission evaluated successfully",
  "candidate": {
    "id": 1,
    "name": "Asha Rao",
    "email": "asha@example.com",
    "role": "Backend Engineer",
    "overall_score": 78.0,
    "strengths": [
      "Clear API design",
      "Strong validation approach",
      "Good reliability and error handling"
    ],
    "weaknesses": [
      "Needs stronger testing coverage"
    ],
    "hiring_recommendation": "Hire",
    "ai_feedback": "Asha Rao scored 7.8/10 for the Backend Engineer task...",
    "status": "Evaluated"
  }
}
```

Note: `POST /api/evaluate/` still exists for backward compatibility, but new frontend work should use `POST /api/submit`.

## Auth

The backend uses a simple bearer token for local/demo authentication.

Send authenticated requests with:

```txt
Authorization: Bearer <access_token>
```

### `POST /api/auth/signup`

Creates a recruiter or candidate account.

Candidate signup also creates or links a candidate profile.

Request:

```json
{
  "name": "Asha Rao",
  "email": "asha@example.com",
  "password": "secret123",
  "role": "candidate",
  "applied_role": "Backend Engineer"
}
```

Recruiter signup:

```json
{
  "name": "Hiring Manager",
  "email": "recruiter@example.com",
  "password": "secret123",
  "role": "recruiter"
}
```

Response:

```json
{
  "access_token": "token-value",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Asha Rao",
    "email": "asha@example.com",
    "role": "candidate",
    "candidate_id": 1
  }
}
```

### `POST /api/auth/login`

Logs in an existing user.

Request:

```json
{
  "email": "asha@example.com",
  "password": "secret123"
}
```

Response shape is the same as signup.

### `GET /api/auth/me`

Returns the authenticated user.

Requires bearer token.

## Candidate Portal

### `GET /api/candidate/me/dashboard`

Returns the logged-in candidate's profile, persisted task assignment, and submission status.

Requires candidate bearer token.

Response:

```json
{
  "user": {
    "id": 1,
    "name": "Asha Rao",
    "email": "asha@example.com",
    "role": "candidate",
    "candidate_id": 1
  },
  "candidate": {
    "id": 1,
    "name": "Asha Rao",
    "email": "asha@example.com",
    "role": "Backend Engineer",
    "status": "Not Attended"
  },
  "assigned_task": {
    "id": "backend-api-001",
    "role": "Backend Engineer",
    "title": "Build a Candidate Submission API",
    "task_type": "coding",
    "prompt": "Design a FastAPI endpoint...",
    "evaluation_focus": [
      "API design",
      "validation",
      "database reliability",
      "error handling",
      "response clarity"
    ],
    "time_limit_minutes": 60
  },
  "assignment_id": 1,
  "submission_status": "Assigned"
}
```

### `POST /api/candidate/me/submit`

Submits the logged-in candidate's assigned task.

Requires candidate bearer token.

Request:

```json
{
  "answer": "I would build FastAPI routes with validation, database handling, rollback on exception, tests, and clean response models.",
  "resume_score": 42,
  "completion_time": "38 mins",
  "live_malpractice_flags": []
}
```

Response shape is the same as `POST /api/submit`.

## Results

### `GET /api/results`

Returns ranked candidate results for the recruiter dashboard.

Response fields include:

```txt
id
name
role
score
score_out_of_10
status
hiring_recommendation
hidden_talent
why_not_selected
```

Example response item:

```json
{
  "id": 1,
  "name": "Asha Rao",
  "role": "Backend Engineer",
  "score": 78.0,
  "score_out_of_10": 7.8,
  "status": "Evaluated",
  "hiring_recommendation": "Hire",
  "hidden_talent": true,
  "why_not_selected": "Not selected yet because the recruiter has not made a final shortlist decision."
}
```

### `GET /api/results/{candidate_id}`

Returns the full stored candidate evaluation.

Example:

```txt
GET /api/results/1
```

## Decision Insights

### `GET /api/results/{candidate_id}/decision-insights`

Returns explainability fields for selection, rejection, and Hidden Talent mode.

Example:

```txt
GET /api/results/1/decision-insights
```

Response:

```json
{
  "candidate_id": 1,
  "score_out_of_10": 7.8,
  "selected": false,
  "hidden_talent": true,
  "hidden_talent_reason": "Resume signal is modest (42/100), but task performance is strong (78.0/100).",
  "why_not_selected": "Not selected yet because the recruiter has not made a final shortlist decision.",
  "decision_reasoning": "Asha Rao is a Hidden Talent candidate: 7.8/10 task performance with weaker resume signals. Prioritize a human review."
}
```

Hidden Talent rule:

```txt
resume_score <= 50
and
overall_score >= 75
```

## Candidates

### `GET /api/candidates/`

Returns all candidates.

### `GET /api/candidates/{candidate_id}`

Returns one candidate by ID.

### `POST /api/candidates/`

Creates a candidate profile manually.

### `POST /api/candidates/bulk`

Creates multiple candidate profiles.

### `PATCH /api/candidates/{candidate_id}/decision`

Shortlists or rejects a candidate.

Request:

```json
{
  "status": "Shortlisted",
  "reason": "",
  "notes": "Strong task performance."
}
```

Allowed practical statuses:

```txt
Shortlisted
Rejected
```

## Candidate Comparison

### `GET /api/candidates/compare?candidate1_id={id1}&candidate2_id={id2}`

Compares two candidates and returns the stronger candidate with reasoning.

Example:

```txt
GET /api/candidates/compare?candidate1_id=1&candidate2_id=2
```

Response:

```json
{
  "candidate_1": {},
  "candidate_2": {},
  "stronger_candidate_id": 1,
  "reasoning": "Asha Rao has a higher overall score and better aligned strengths for the role."
}
```

Comparison also considers Hidden Talent when scores are close.

## Frontend Integration Checklist

Use these helpers in `frontend/src/services/api.js`:

```js
signup(data)                  // POST /api/auth/signup
login(data)                   // POST /api/auth/login
getMe(token)                  // GET /api/auth/me
getCandidateDashboard(token)  // GET /api/candidate/me/dashboard
submitMyAssessment(data)      // POST /api/candidate/me/submit
assignTask(role)              // POST /api/tasks/assign
submitAssessment(data)        // POST /api/submit
getResults()                  // GET /api/results
getCandidateResult(id)        // GET /api/results/{id}
getDecisionInsights(id)       // GET /api/results/{id}/decision-insights
```

Recommended frontend order:

```txt
1. Login/signup stores access token and role
2. Recruiter role routes to recruiter dashboard
3. Candidate role routes to candidate dashboard
4. Candidate dashboard uses /api/candidate/me/dashboard
5. Candidate assessment submits to /api/candidate/me/submit
6. Recruiter dashboard shows /api/results ranking
7. CandidateDetails shows decision insights
8. Compare page highlights Hidden Talent reasoning
```
