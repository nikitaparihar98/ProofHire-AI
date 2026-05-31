# ProofHire AI 🚀

### *"Hire on proof. Not on paper."*

ProofHire AI is an AI-powered technical assessment, candidate authenticity verification, and malpractice proctoring platform. By combining interactive coding evaluations, resume claim verification, recruiter analytics, and proctoring telemetry, it helps organizations identify top engineering talent based on demonstrated skills rather than credentials alone.

---

## 🌟 Key Features

### Skill-Over-Pedigree Verification

* Extracts technical claims from uploaded resumes.
* Cross-references claims against actual coding performance and assessment results.
* Detects potential overclaims and underrepresented skills.

### Hidden Talent Spotlight

* Highlights candidates with strong technical performance despite modest resume credentials.
* Helps recruiters identify capable developers from non-traditional backgrounds.

### Explainable Hiring Decisions

* Generates transparent AI-powered feedback.
* Provides reasoning behind candidate evaluations and recommendations.

### Malpractice Detection & Proctoring

* Tab-switch monitoring.
* Copy-paste detection.
* Proctoring event logs and malpractice scoring.

### Recruiter Dashboard

* Candidate pipeline management.
* Technical evaluation analytics.
* Candidate messaging and communication tools.

---

## 🛠️ Technology Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Chart.js
* Lucide Icons

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* WatchFiles
* Llama API Integration

### Testing

* Pytest

---

## 📂 Project Structure

```text
RecruitAi-main/
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

* Python 3.10 or later
* Node.js 18 or later
* npm

---

## Backend Setup

**Important:** Run all backend commands from the project root directory (`RecruitAi-main`).

### 1. Navigate to Project Root

```bash
cd RecruitAi-main
```

### 2. Create Virtual Environment

```bash
python3 -m venv backend/venv
```

### 3. Activate Virtual Environment

#### macOS/Linux

```bash
source backend/venv/bin/activate
```

#### Windows

```bash
backend\venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### 5. Create Environment File

Create a `.env` file in the project root:

```env
DATABASE_URL=sqlite:///./proofhire.db
LLAMA_API_KEY=your-llama-api-key
AUTH_SECRET=proofhire-local-dev-secret
```

### 6. Initialize Database

```bash
python -m backend.init_db
```

This command creates and seeds the SQLite database.

### 7. Start Backend Server

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

## Frontend Setup

Open a new terminal window.

### 1. Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## 🧪 Running Tests

From the project root:

```bash
PYTHONPATH=. pytest backend/tests
```

---

## 🔒 Security

* Token-based authentication.
* CORS support for local development environments.
* SQLite database with automatic schema synchronization.

---

## ⚠️ Common Issue

### ModuleNotFoundError: No module named 'backend'

This occurs when the backend is started from inside the `backend` folder.

❌ Incorrect:

```bash
cd backend
uvicorn backend.main:app --reload
```

✅ Correct:

```bash
cd RecruitAi-main
python -m uvicorn backend.main:app --reload
```

Always start the backend from the project root directory.

---

## 💡 Features to Explore

* Resume Verification
* Candidate Skill Analysis
* Hidden Talent Detection
* Recruiter Dashboard
* Explainable AI Evaluations
* Proctoring & Malpractice Monitoring
* Candidate Messaging System

---

## 📄 License

This project is intended for educational, research, and recruitment technology demonstrations.
