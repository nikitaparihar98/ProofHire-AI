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
    
    cursor.execute("SELECT * FROM messages")
    messages = cursor.fetchall()
    print(f"Messages count: {len(messages)}")
    for msg in messages:
        print(msg)
        
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    print(f"Users count: {len(users)}")
    for u in users:
        print(u)
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
