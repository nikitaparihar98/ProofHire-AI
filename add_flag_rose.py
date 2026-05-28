import sqlite3
import json

conn = sqlite3.connect('c:/Projects/RecruitAi/proofhire.db')
c = conn.cursor()

c.execute("SELECT id, malpractice_flags, plagiarism_risk_level FROM candidates WHERE name LIKE '%ROSE%';")
row = c.fetchone()
if row:
    cid, flags_str, risk = row
    flags = json.loads(flags_str) if flags_str else []
    if len(flags) == 0:
        flags.append("Multiple faces detected in frame")
    
    new_flags_str = json.dumps(flags)
    c.execute("UPDATE candidates SET malpractice_flags = ?, plagiarism_risk_level = 'High' WHERE id = ?", (new_flags_str, cid))
    conn.commit()
    print("Updated ROSE with a malpractice flag!")
else:
    print("ROSE not found.")
