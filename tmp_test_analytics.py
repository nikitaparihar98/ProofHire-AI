import sys
import os
sys.path.append('c:/Projects/RecruitAi')

from backend.core.database import SessionLocal
from backend.models.models import Candidate
from backend.services.analytics import update_candidate_analytics

def main():
    # create DB session
    db = SessionLocal()
    try:
        # get first candidate
        cand = db.query(Candidate).first()
        if not cand:
            print('No candidates found in DB.')
            return
        updated = update_candidate_analytics(db, cand.id)
        # Print key analytics fields
        print('Candidate ID:', updated.id)
        print('Honesty Score:', getattr(updated, 'honesty_score', None))
        print('Overclaim Risk Score:', getattr(updated, 'overclaim_risk_score', None))
        print('Underclaim Score:', getattr(updated, 'underclaim_score', None))
        print('Growth Nudges:', getattr(updated, 'growth_nudges', None))
        print('Red Flag Alerts:', getattr(updated, 'red_flag_alerts', None))
        print('Final Recruiter Score:', getattr(updated, 'final_recruiter_score', None))
        print('Recruiter Summary:', getattr(updated, 'recruiter_summary', None))
    finally:
        db.close()

if __name__ == '__main__':
    main()
