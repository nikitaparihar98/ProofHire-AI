<<<<<<< HEAD
from core.database import engine, Base
from models import models
=======
from backend.core.database import engine, Base
from backend.models import models
>>>>>>> origin/geshna-backend

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Database reset successfully.")
