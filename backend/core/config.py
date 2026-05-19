import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database URL
    # Defaults to SQLite for local development
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./proofhire.db")
    
    # Llama API Key
    LLAMA_API_KEY: str = os.getenv("LLAMA_API_KEY", "")

    class Config:
        env_file = ".env"

settings = Settings()
