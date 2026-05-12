import json
from collections.abc import Callable, Iterator
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from models.schemas import Role, SubmissionRequest


@pytest.fixture
def sample_submission_request() -> SubmissionRequest:
    return SubmissionRequest(
        candidate_id="cand-001",
        candidate_name="Test User",
        role=Role.software_engineer,
        task_id="task-1",
        submission_text="This is a sample submission with enough characters for validation.",
    )


@pytest.fixture
def mock_completion_json() -> Callable[[dict], MagicMock]:
    """Build a fake OpenAI chat completion response whose message.content is JSON."""

    def _make(data: dict) -> MagicMock:
        resp = MagicMock()
        choice = MagicMock()
        msg = MagicMock()
        msg.content = json.dumps(data)
        choice.message = msg
        resp.choices = [choice]
        return resp

    return _make


@pytest.fixture(autouse=True)
def _no_retry_sleep(monkeypatch: pytest.MonkeyPatch) -> None:
    """Avoid real delays when AIEvaluationEngine retries after failures."""

    async def _instant_sleep(*_a: object, **_k: object) -> None:
        return None

    monkeypatch.setattr("services.ai_engine.asyncio.sleep", _instant_sleep)


@pytest.fixture
def patched_engine(
    monkeypatch: pytest.MonkeyPatch,
) -> Iterator[tuple[Any, AsyncMock]]:
    """AIEvaluationEngine with AsyncOpenAI.chat.completions.create mocked."""
    monkeypatch.setenv("OPENAI_API_KEY", "test-key-not-used")

    create_mock = AsyncMock()
    mock_client = MagicMock()
    mock_client.chat.completions.create = create_mock

    with patch("services.ai_engine.AsyncOpenAI", return_value=mock_client):
        from services.ai_engine import AIEvaluationEngine

        yield AIEvaluationEngine(), create_mock
