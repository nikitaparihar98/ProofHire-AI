from sqlalchemy import inspect, text

from backend.core.database import Base, engine


SQLITE_DEFAULTS = {
    "candidates": {
        "strengths": "'[]'",
        "weaknesses": "'[]'",
        "hiring_recommendation": "'Pending'",
        "ai_feedback": "'Awaiting evaluation.'",
        "technical_score": "0.0",
        "communication_score": "0.0",
        "problem_solving_score": "0.0",
        "recruiter_summary": "''",
        "submission_data": "'{}'",
        "status": "'Not Attended'",
        "rejection_reason": "''",
        "recruiter_notes": "''",
        "plagiarism_score": "0.0",
        "originality_score": "100.0",
        "plagiarism_risk_level": "'Low'",
        "ai_generated_suspicion": "0.0",
        "authenticity_summary": "'Not evaluated yet.'",
        "malpractice_flags": "'[]'",
        "resume_skills": "'{}'",
        "proven_skills": "'{}'",
        "skill_authenticity_score": "0.0",
        "authenticity_gaps": "'[]'",
        "growth_nudges": "'[]'",
        "honesty_score": "0.0",
        "skill_mismatch": "'{}'",
        "hidden_talents": "'{}'",
        "malpractice_severity": "0.0",
        "claimed_skills_json": "'{}'",
        "demonstrated_skills_json": "'{}'",
        "ai_content_score": "0.0",
        "resume_honesty_index": "0.0",
        "overclaim_risk_score": "0.0",
        "underclaim_score": "0.0",
        "skill_gap_analysis": "'{}'",
        "red_flag_alerts": "'[]'",
        "demonstrated_skills": "'{}'",
        "claimed_skills_analysis": "'{}'",
        "candidate_strength_summary": "''",
        "candidate_weakness_summary": "''",
        "edge_case_score": "0.0",
        "consistency_score": "0.0",
        "recruiter_risk_level": "'Low'",
        "final_recruiter_score": "0.0",
    }
}


def _column_definition(column) -> str:
    column_type = column.type.compile(dialect=engine.dialect)
    return f"{column.name} {column_type}"


def sync_sqlite_schema() -> None:
    if engine.dialect.name != "sqlite":
        return

    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    with engine.begin() as connection:
        for table in Base.metadata.sorted_tables:
            if table.name not in existing_tables:
                continue

            existing_columns = {
                column["name"] for column in inspector.get_columns(table.name)
            }

            for column in table.columns:
                if column.primary_key or column.name in existing_columns:
                    continue

                connection.execute(
                    text(
                        f"ALTER TABLE {table.name} "
                        f"ADD COLUMN {_column_definition(column)}"
                    )
                )

                existing_columns.add(column.name)

            for column_name, default_sql in SQLITE_DEFAULTS.get(table.name, {}).items():
                if column_name in existing_columns:
                    connection.execute(
                        text(
                            f"UPDATE {table.name} "
                            f"SET {column_name} = {default_sql} "
                            f"WHERE {column_name} IS NULL"
                        )
                    )
