import sqlite3
import json

conn = sqlite3.connect('proofhire.db')
cursor = conn.cursor()

try:
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(f"Tables: {tables}")

    cursor.execute("SELECT * FROM candidates")
    rows = cursor.fetchall()
    print(f"Candidates count: {len(rows)}")
    for row in rows:
        print(row)
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
