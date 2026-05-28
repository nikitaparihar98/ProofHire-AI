import sys
sys.path.append('c:/Projects/RecruitAi')

from backend.core.database import engine
from sqlalchemy import text

migration_sql = [
    "ALTER TABLE candidates ADD COLUMN resume_honesty_index FLOAT;",
    "ALTER TABLE candidates ADD COLUMN overclaim_risk_score FLOAT;",
    "ALTER TABLE candidates ADD COLUMN underclaim_score FLOAT;",
    "ALTER TABLE candidates ADD COLUMN skill_gap_analysis TEXT;",
    "ALTER TABLE candidates ADD COLUMN red_flag_alerts TEXT;",
    "ALTER TABLE candidates ADD COLUMN demonstrated_skills TEXT;",
    "ALTER TABLE candidates ADD COLUMN claimed_skills_analysis TEXT;",
    "ALTER TABLE candidates ADD COLUMN candidate_strength_summary TEXT;",
    "ALTER TABLE candidates ADD COLUMN candidate_weakness_summary TEXT;",
    "ALTER TABLE candidates ADD COLUMN edge_case_score FLOAT;",
    "ALTER TABLE candidates ADD COLUMN consistency_score FLOAT;",
]

with engine.connect() as conn:
    for stmt in migration_sql:
        try:
            conn.execute(text(stmt))
            print(f"Executed: {stmt.strip()}")
        except Exception as e:
            print(f"Failed to execute: {stmt.strip()} -> {e}")
    conn.commit()
print("Migration completed.")
