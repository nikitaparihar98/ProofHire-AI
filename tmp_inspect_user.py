import sys, os
sys.path.append('c:/Projects/RecruitAi')
from backend.core.database import engine
from sqlalchemy import inspect
inspector = inspect(engine)
print('User columns:', inspector.get_columns('users'))
