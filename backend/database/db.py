import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY or SUPABASE_SERVICE_ROLE_KEY are required")

try:
    from supabase import create_client
except ImportError as exc:
    raise RuntimeError("Install the supabase package to use backend.database.db") from exc

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
