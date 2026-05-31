# test_conn.py
from pathlib import Path
from dotenv import load_dotenv
import os, psycopg2

# Load .env from the backend folder (adjust if you move the file)
env_path = Path(__file__).parent / "backend" / ".env"
load_dotenv(dotenv_path=env_path)

url = os.getenv('DATABASE_URL')
try:
    conn = psycopg2.connect(url, connect_timeout=5)
    print('Connection succeeded')
    conn.close()
except Exception as e:
    print('Connection failed:', e)