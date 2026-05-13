import sqlite3
import os

def update_db():
    db_path = os.path.join(os.getcwd(), "proofhire.db")
    if not os.path.exists(db_path):
        print("Database not found. Run main.py first.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("Updating interviews table...")
    try:
        # Add new columns if they don't exist
        columns_to_add = [
            ("interview_title", "TEXT DEFAULT 'Technical Interview'"),
            ("mode", "TEXT DEFAULT 'Online'"),
            ("notes", "TEXT")
        ]

        # Check existing columns
        cursor.execute("PRAGMA table_info(interviews)")
        existing_columns = [col[1] for col in cursor.fetchall()]

        for col_name, col_def in columns_to_add:
            if col_name not in existing_columns:
                print(f"Adding column {col_name}...")
                cursor.execute(f"ALTER TABLE interviews ADD COLUMN {col_name} {col_def}")
        
        conn.commit()
        print("Interviews table updated successfully.")
    except Exception as e:
        print(f"Error updating interviews table: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    update_db()
