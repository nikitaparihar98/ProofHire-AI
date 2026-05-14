from database.db import supabase

response = supabase.table("evaluations").insert({
    "overall_score": 8.5,
    "recommendation": "Recommended"
}).execute()

print(response)