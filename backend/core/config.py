import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


ENV_FILE = Path(__file__).resolve().parents[1] / ".env"

class Settings(BaseSettings):
    # Database URL
    # Defaults to SQLite for local development
    DATABASE_URL: str = "sqlite:///./proofhire.db"
    
    # Llama API Key
    LLAMA_API_KEY: str = ""

    # Local auth token signing secret
    AUTH_SECRET: str = "proofhire-local-dev-secret"

    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")

settings = Settings()
