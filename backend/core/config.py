import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database URL
    # Defaults to SQLite for local development
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./proofhire.db")
    
    # Llama API Key
    LLAMA_API_KEY: str = os.getenv("LLAMA_API_KEY", "")

<<<<<<< HEAD
=======
    # Local auth token signing secret
    AUTH_SECRET: str = os.getenv("AUTH_SECRET", "proofhire-local-dev-secret")

>>>>>>> origin/geshna-backend
    class Config:
        env_file = ".env"

settings = Settings()
