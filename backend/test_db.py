import os
from pathlib import Path

import pytest
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

pytest.importorskip("supabase")

if os.getenv("RUN_SUPABASE_INTEGRATION_TESTS") != "1":
    pytest.skip("Set RUN_SUPABASE_INTEGRATION_TESTS=1 to run Supabase integration tests", allow_module_level=True)

if not os.getenv("SUPABASE_URL") or not (
    os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
):
    pytest.skip("Supabase client environment is not configured", allow_module_level=True)

from database.db import supabase


def test_supabase_evaluations_insert():
    response = supabase.table("evaluations").insert({
        "overall_score": 8.5,
        "recommendation": "Recommended",
    }).execute()

    assert response.data
