"""
Migration script to add missing columns to the candidates table.
The model was updated but the SQLite database was not migrated.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "proofhire.db")

def get_existing_columns(cursor, table_name):
    cursor.execute(f"PRAGMA table_info({table_name})")
    return [row[1] for row in cursor.fetchall()]

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get existing columns
    existing = get_existing_columns(cursor, "candidates")
    print(f"Existing columns in 'candidates': {existing}")
    
    # Columns to add with their types and defaults
    new_columns = {
        "technical_score": "REAL DEFAULT 0.0",
        "communication_score": "REAL DEFAULT 0.0",
        "problem_solving_score": "REAL DEFAULT 0.0",
        "recruiter_summary": "TEXT DEFAULT ''",
    }
    
    for col_name, col_type in new_columns.items():
        if col_name not in existing:
            sql = f"ALTER TABLE candidates ADD COLUMN {col_name} {col_type}"
            print(f"  Adding column: {col_name} ({col_type})")
            cursor.execute(sql)
        else:
            print(f"  Column '{col_name}' already exists, skipping.")
    
    # Also check task_assignments table
    existing_ta = get_existing_columns(cursor, "task_assignments")
    print(f"\nExisting columns in 'task_assignments': {existing_ta}")
    
    ta_columns = {
        "malpractice_log": "TEXT DEFAULT '[]'",
    }
    
    for col_name, col_type in ta_columns.items():
        if col_name not in existing_ta:
            sql = f"ALTER TABLE task_assignments ADD COLUMN {col_name} {col_type}"
            print(f"  Adding column: {col_name}")
            cursor.execute(sql)
        else:
            print(f"  Column '{col_name}' already exists, skipping.")
    
    conn.commit()
    conn.close()
    print("\nMigration complete!")

if __name__ == "__main__":
    migrate()
