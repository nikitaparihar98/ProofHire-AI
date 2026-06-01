# ProofHire AI 🚀

**"Hire on Proof. Not on Paper."**

ProofHire AI is an AI-powered technical assessment, candidate authenticity verification, and malpractice proctoring platform. By combining interactive coding evaluations, resume claim verification, recruiter analytics, AI-powered interviews, and live monitoring, it helps organizations identify top engineering talent based on demonstrated skills rather than credentials alone.

---

# 🌟 Key Features

## Skill-Over-Pedigree Verification

* Extracts technical claims from uploaded resumes.
* Cross-references claims against actual coding performance and assessment results.
* Detects potential overclaims and underrepresented skills.

## Hidden Talent Spotlight

* Highlights candidates with strong technical performance despite modest resume credentials.
* Helps recruiters identify capable developers from non-traditional backgrounds.

## Explainable Hiring Decisions

* Generates transparent AI-powered feedback.
* Provides reasoning behind candidate evaluations and recommendations.

## Malpractice Detection & Proctoring

* Tab-switch monitoring.
* Activity tracking.
* Webcam monitoring.
* Proctoring event logs and malpractice scoring.

## Interview Scheduling & AI Interviews

* Schedule and manage candidate interviews.
* Track interview status and outcomes.
* Conduct AI-powered interviews with automated evaluation and feedback.

## Recruiter Dashboard

* Candidate pipeline management.
* Technical evaluation analytics.
* Candidate comparison tools.
* Candidate messaging and communication.

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Lucide React
* Recharts

## Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* SQLAlchemy

## AI / Evaluation Engine

* OpenAI API
* GPT-4o-mini
* AI-powered candidate evaluation
* Candidate scoring
* Feedback generation
* Candidate comparison

## Database

* SQLite (Current Implementation)
* SQLAlchemy ORM
* Supabase / PostgreSQL Support

## Live Monitoring

* WebSockets
* Browser Activity Tracking
* Webcam Access (getUserMedia)
* In-Memory Session Tracking

## Authentication & API Security

* JWT-style Authentication
* Protected FastAPI Routes
* Role-Based Access Control
* Axios Interceptors

---

# 📂 Project Structure

```text
ProofHireAI/
├── backend/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── routers/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── tests/
│   ├── init_db.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── proofhire.db
```

---

# 🚀 Installation & Setup

## Prerequisites

Ensure the following are installed:

* Python 3.10+
* Node.js 18+
* npm

---

# Backend Setup

Run all backend commands from the project root directory.

## 1. Navigate to Project Root

```bash
cd ProofHireAI
```

## 2. Create Virtual Environment

```bash
python3 -m venv backend/venv
```

## 3. Activate Virtual Environment

### macOS/Linux

```bash
source backend/venv/bin/activate
```

### Windows

```bash
backend\venv\Scripts\activate
```

## 4. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

## 5. Create Environment File

Create a `.env` file in the project root:

```env
DATABASE_URL=sqlite:///./proofhire.db
OPENAI_API_KEY=your-openai-api-key
AUTH_SECRET=proofhire-local-dev-secret
```

## 6. Initialize Database

```bash
python -m backend.init_db
```

This command creates and seeds the SQLite database.

## 7. Start Backend Server

```bash
python -m uvicorn backend.main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

### API Documentation

```text
http://127.0.0.1:8000/docs
```

### Health Check

```text
http://127.0.0.1:8000/health
```

---

# Frontend Setup

Open a new terminal window.

## 1. Navigate to Frontend

```bash
cd frontend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Development Server

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

# 🧪 Running Tests

From the project root:

```bash
PYTHONPATH=. pytest backend/tests
```

---

# 🔒 Security

* JWT-based authentication.
* Protected API routes.
* Role-based access control.
* CORS support for development environments.
* Secure candidate and recruiter access management.

---

# ⚠️ Common Issue

### ModuleNotFoundError: No module named 'backend'

This occurs when the backend is started from inside the backend folder.

❌ Incorrect

```bash
cd backend
uvicorn backend.main:app --reload
```

✅ Correct

```bash
cd ProofHireAI
python -m uvicorn backend.main:app --reload
```

Always start the backend from the project root directory.

---

# 💡 Features to Explore

* Resume Verification
* Technical Assessments
* Coding Challenges
* Candidate Skill Analysis
* Candidate Comparison
* Hidden Talent Detection
* AI Interviews
* Interview Scheduling
* Recruiter Dashboard
* Explainable AI Evaluations
* Live Monitoring
* Proctoring & Malpractice Detection
* Candidate Messaging System

---

# 📄 License

This project is intended for educational, research, and recruitment technology demonstrations.

**ProofHire AI — Hire on Proof, Not Paper.**
