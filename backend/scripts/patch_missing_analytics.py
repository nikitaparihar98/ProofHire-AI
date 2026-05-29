import sqlite3
import os

def patch():
    db_path = 'proofhire.db'
    if not os.path.exists(db_path):
        db_path = '../proofhire.db'
        if not os.path.exists(db_path):
            print("Could not find proofhire.db")
            return
            
    print(f"Opening database: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check existing columns in candidates
    cursor.execute("PRAGMA table_info(candidates)")
    columns = [col[1] for col in cursor.fetchall()]
    print(f"Current candidates columns ({len(columns)}): {columns}")
    
    # Define expected columns and their SQLite types
    expected_columns = [
        ("email", "TEXT"),
        ("experience_level", "TEXT"),
        ("assessment_type", "TEXT"),
        ("resume_url", "TEXT"),
        ("overall_score", "REAL"),
        ("strengths", "TEXT"),
        ("weaknesses", "TEXT"),
        ("hiring_recommendation", "TEXT"),
        ("ai_feedback", "TEXT"),
        ("technical_score", "REAL"),
        ("communication_score", "REAL"),
        ("problem_solving_score", "REAL"),
        ("recruiter_summary", "TEXT"),
        ("submission_data", "TEXT"),
        ("status", "TEXT"),
        ("rejection_reason", "TEXT"),
        ("recruiter_notes", "TEXT"),
        ("plagiarism_score", "REAL"),
        ("originality_score", "REAL"),
        ("plagiarism_risk_level", "TEXT"),
        ("ai_generated_suspicion", "REAL"),
        ("authenticity_summary", "TEXT"),
        ("malpractice_flags", "TEXT"),
        ("resume_skills", "TEXT"),
        ("proven_skills", "TEXT"),
        ("skill_authenticity_score", "REAL"),
        ("authenticity_gaps", "TEXT"),
        ("growth_nudges", "TEXT"),
        ("honesty_score", "REAL"),
        ("skill_mismatch", "TEXT"),
        ("hidden_talents", "TEXT"),
        ("malpractice_severity", "REAL"),
        ("claimed_skills_json", "TEXT"),
        ("demonstrated_skills_json", "TEXT"),
        ("ai_content_score", "REAL"),
        ("resume_honesty_index", "REAL"),
        ("overclaim_risk_score", "REAL"),
        ("underclaim_score", "REAL"),
        ("skill_gap_analysis", "TEXT"),
        ("red_flag_alerts", "TEXT"),
        ("demonstrated_skills", "TEXT"),
        ("claimed_skills_analysis", "TEXT"),
        ("candidate_strength_summary", "TEXT"),
        ("candidate_weakness_summary", "TEXT"),
        ("edge_case_score", "REAL"),
        ("consistency_score", "REAL"),
        ("recruiter_risk_level", "TEXT"),
        ("final_recruiter_score", "REAL")
    ]
    
    added_count = 0
    for col_name, col_type in expected_columns:
        if col_name not in columns:
            print(f"Adding column {col_name} ({col_type})...")
            try:
                cursor.execute(f"ALTER TABLE candidates ADD COLUMN {col_name} {col_type}")
                added_count += 1
            except Exception as e:
                print(f"Failed to add column {col_name}: {e}")
        
    conn.commit()
    
    # Verify again
    cursor.execute("PRAGMA table_info(candidates)")
    updated_columns = [col[1] for col in cursor.fetchall()]
    print(f"Updated candidates columns ({len(updated_columns)})")
    print(f"Successfully added {added_count} missing columns.")
    
    conn.close()

if __name__ == "__main__":
    patch()
