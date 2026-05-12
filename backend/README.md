# RecruitAI Backend

## Setup

### 1. Clone the repo and switch to backend1 branch
git checkout backend1

### 2. Go to backend folder
cd backend

### 3. Create your .env file
cp .env.example .env
# Open .env and add your own OpenAI API key

### 4. Install dependencies
pip install -r requirements.txt

### 5. Run the server
uvicorn main:app --reload --port 8000

### 6. Test it
Open http://localhost:8000/docs in browser

## API Endpoints
| Method | URL | What it does |
|--------|-----|--------------|
| POST | /evaluate | Evaluate a candidate submission |
| POST | /compare | Compare two candidates |
| POST | /why-not-selected | Explain rejection to candidate |
| GET  | /candidates | Get all candidates ranked |
| GET  | /candidates/hidden-talents | Get hidden talent candidates |
| GET  | /health | Health check |

## Each teammate needs their own OpenAI API key
Get one free at: https://platform.openai.com/api-keys
Add it to your local .env file only — never push .env to Giub
