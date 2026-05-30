# ProofHire AI 🚀
### *"Hire on proof. Not on paper."*

ProofHire AI is a state-of-the-art, AI-driven technical assessment, candidate authenticity verification, and malpractice proctoring platform. By combining interactive technical challenges, automatic code-level claim-to-proof cross-referencing, smart proctoring telemetry, and premium dark/light interfaces, it helps modern teams eliminate resume pedigree bias and confidently identify top engineering talents.

---

## 🌟 Key Differentiators & Brand Pillars

1. **Skill-Over-Pedigree Verification**:
   * Auto-extracts claims from uploaded resumes and cross-references them against actual code/task execution.
   * Leverages advanced keyword heuristics and code patterns to detect overclaims (deducting score dynamically) or underclaims (boosting them!).
2. **Hidden Talent Spotlight**:
   * Automatically detects and spotlights "Hidden Talents"—capable developers with non-traditional backgrounds (modest resume scores but top-tier technical evaluation).
   * Renders high-visibility animated spotlight frames in recruiter views to prevent credential bias.
3. **Explainable Rejection & Selection**:
   * Provides immediate, constructive AI feedback to candidates and explains decisions transparently to recruiters to eliminate "black-box" hiring frustration.
4. **Malpractice & Proctoring Telemetry**:
   * Live proctoring, event log, code paste monitoring, and active tab-switch detection dynamically tracking malpractice severity.
5. **Interactive Unified Messaging & Threading**:
   * Full partitioned split-screen candidate inbox allowing private messaging threads across multiple recruiters.
6. **Automatic SQLite Schema Alignment**:
   * Out-of-the-box hot schema migrations and synchronization via auto-introspecting SQLAlchemy engine to eliminate setup database crashes.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Tailwind CSS, Lucide icons, Chart.js, HSL-harmonized Dark/Light appearance switcher, and custom radial SVG gauges.
* **Backend**: FastAPI, SQLAlchemy (SQLite ORM), Pydantic, WatchFiles (Hot Reload), Llama API service layer.
* **Testing**: pytest-based automated assertion suite.

---

## 📂 Project Architecture

```txt
RecruitAi/
├── backend/                  # FastAPI Application
│   ├── core/                 # DB, config, and schema sync (schema_sync.py)
│   ├── models/               # SQLAlchemy schema definitions (models.py)
│   ├── routers/              # Modular API endpoints (candidates, portal, auth)
│   ├── schemas/              # Pydantic schemas (schemas.py)
│   ├── services/             # Llama analysis, auth, and analytics services
│   └── tests/                # Automated pytest files
├── frontend/                 # Vite + React Client
│   ├── src/
│   │   ├── components/       # Visual components (Layout, Sidebar, Charts)
│   │   ├── pages/            # Viewports (Dashboard, Profile, ResumeVerification)
│   │   ├── context/          # React Auth and Theme context providers
│   │   └── services/         # Axios API clients
│   └── tailwind.config.js    # Custom Tailwind typography and dark mode mapping
└── proofhire.db              # SQLite Database file
```

---

## 🚀 Quick Setup & Installation

### Prerequisite
Ensure you have **Python 3.10+** and **Node.js 18+** installed on your system.

### 1. Backend Setup
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install all dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment file:
   Create a `.env` file in the root workspace or backend folder:
   ```env
   DATABASE_URL=sqlite:///./proofhire.db
   LLAMA_API_KEY=your-llama-api-key-here
   AUTH_SECRET=proofhire-local-dev-secret
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn backend.main:app --reload
   ```
   *The backend will automatically synchronize the SQLite schema and start on:* [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 2. Frontend Setup
1. In a new terminal window, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend client will spin up on:* [http://localhost:5173/](http://localhost:5173/)

---

## 🧪 Testing & Verification

We maintain a suite of automated unit and integration assertions validating our Llama skill evaluation algorithms and authenticity rating pipeline.

Run all tests in the backend virtual environment:
```bash
PYTHONPATH=backend pytest backend/tests
```

---

## 🔒 Security & CORS Policy

* **Regex CORS Allowed Origins**: Automatically matches any local development origin (`http://localhost:517*` or `http://127.0.0.1:517*`) dynamically, preserving secure Cookie/Token credential transmission.
* **Tokenized Authentications**: Utilizes clean, bearer-token validations (`Authorization: Bearer <token>`) across endpoints.