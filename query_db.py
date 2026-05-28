import sqlite3
conn = sqlite3.connect('c:/Projects/RecruitAi/proofhire.db')
c = conn.cursor()
c.execute("SELECT id, name, malpractice_flags, plagiarism_risk_level FROM candidates WHERE name LIKE '%Garram%';")
print(c.fetchall())
