"""Thin wrapper around the OpenAI client with shared configuration."""

import os
from openai import AsyncOpenAI, OpenAIError  # noqa: F401 – re-exported for routes

_client: AsyncOpenAI | None = None


def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY environment variable is not set.")
        _client = AsyncOpenAI(api_key=api_key)
    return _client


DEFAULT_MODEL = "gpt-4o-mini"
