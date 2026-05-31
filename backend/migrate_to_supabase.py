import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import models
from backend.core.database import Base
from dotenv import load_dotenv

load_dotenv()

# Setup engines
sqlite_url = "sqlite:///./proofhire.db"
sqlite_engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
SqliteSession = sessionmaker(bind=sqlite_engine)

supabase_url = os.getenv("DATABASE_URL")
# Supabase PostgreSQL requires pg8000 or psycopg2. SQLAlchemy defaults to psycopg2.
# Let's see if we can connect.
supabase_engine = create_engine(supabase_url)
SupabaseSession = sessionmaker(bind=supabase_engine)

print("Creating tables in Supabase...")
Base.metadata.create_all(bind=supabase_engine)

def migrate_table(model_class, sqlite_session, supabase_session):
    records = sqlite_session.query(model_class).all()
    print(f"Migrating {len(records)} records for {model_class.__tablename__}...")
    
    count = 0
    for record in records:
        # Check if already exists based on ID
        existing = supabase_session.query(model_class).filter_by(id=record.id).first()
        if not existing:
            r_dict = record.__dict__.copy()
            r_dict.pop('_sa_instance_state', None)
            new_record = model_class(**r_dict)
            supabase_session.add(new_record)
            count += 1
            
    supabase_session.commit()
    print(f"Added {count} new records to {model_class.__tablename__}.")

def migrate():
    sqlite_session = SqliteSession()
    supabase_session = SupabaseSession()

    try:
        tables_to_migrate = [
            models.Candidate,
            models.Notification,
            models.Interview,
            models.Message,
            models.User,
            models.TaskAssignment
        ]
        
        for table in tables_to_migrate:
            migrate_table(table, sqlite_session, supabase_session)

        print("\nAll data migrated successfully!")
            
    except Exception as e:
        print(f"Error during migration: {e}")
        supabase_session.rollback()
    finally:
        sqlite_session.close()
        supabase_session.close()

if __name__ == "__main__":
    migrate()
