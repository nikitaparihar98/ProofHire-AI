import sqlite3
import os

def migrate_database():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "proofhire.db")
    print(f"Connecting to database at: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check existing columns in candidates table
    cursor.execute("PRAGMA table_info(candidates)")
    columns = [col[1] for col in cursor.fetchall()]
    
    new_columns = {
        "resume_skills": "JSON DEFAULT '{}'",
        "proven_skills": "JSON DEFAULT '{}'",
        "skill_authenticity_score": "FLOAT DEFAULT 0.0",
        "authenticity_gaps": "JSON DEFAULT '[]'",
        "growth_nudges": "JSON DEFAULT '[]'"
    }
    
    for col_name, col_type in new_columns.items():
        if col_name not in columns:
            print(f"Adding column '{col_name}' to candidates table...")
            cursor.execute(f"ALTER TABLE candidates ADD COLUMN {col_name} {col_type}")
        else:
            print(f"Column '{col_name}' already exists in candidates table.")
            
    conn.commit()
    conn.close()
    print("Database migration completed successfully!")

if __name__ == "__main__":
    migrate_database()
