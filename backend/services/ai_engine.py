"""AI evaluation engine for candidate task submissions."""

import asyncio
import json
import logging
import os
from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

from dotenv import load_dotenv
from openai import AsyncOpenAI, OpenAIError
from pydantic import ValidationError

from models.schemas import (
    CompareRequest,
    CompareResult,
    EvaluationResult,
    SubmissionRequest,
    WhyNotSelectedRequest,
    WhyNotSelectedResult,
)

logger = logging.getLogger(__name__)

MODEL_NAME = "gpt-4o-mini"
MAX_RETRIES = 2  # up to 3 attempts total (initial + 2 retries)

T = TypeVar("T")

_JSON_KEYS_EVAL = frozenset(
    {
        "score",
        "strengths",
        "weaknesses",
        "detailed_feedback",
        "hidden_talent_flag",
        "hidden_talent_reason",
    }
)

_JSON_KEYS_COMPARE = frozenset(
    {
        "winner_id",
        "winner_name",
        "reasoning",
        "candidate_a_score",
        "candidate_b_score",
        "side_by_side",
    }
)

_JSON_KEYS_WHY_NOT = frozenset(
    {
        "explanation",
        "improvement_areas",
        "encouragement",
    }
)

SYSTEM_PROMPT_EVAL = """You are a strict but fair technical evaluator reviewing a candidate's task submission for a hiring process.

Scoring philosophy:
- Be demanding on substance: penalize vague, generic, or copy-paste answers that could apply to any task, lack concrete steps or reasoning, or recycle boilerplate without addressing the prompt.
- Reward genuine creative problem solving, clear thinking, sensible trade-offs, and original approaches—even when syntax, formatting, or polish is imperfect—when the core logic shows strong intent and insight.
- Use the full 0–10 range thoughtfully; do not inflate scores for shallow work.

Hidden talent (hidden_talent_flag):
- Set hidden_talent_flag to true only when the submission and/or resume_summary together suggest exceptional drive, self-direction, or unconventional paths worth flagging to a hiring manager.
- When resume_summary is provided, treat phrases like (including close variants): "self-taught", "bootcamp", "gap year", "non-CS degree", "career switch", "no formal education" as positive signals that may support hidden talent when paired with strong effort or insight in the submission—not as automatic flags; still require substantive evidence in the work itself or summary.
- If hidden_talent_flag is true, hidden_talent_reason must briefly cite what you observed. If false, hidden_talent_reason must be null.

Consistency note: Be consistent. Similar quality submissions should score within 1 point of each other.

Your entire reply MUST be one valid JSON object only, with EXACTLY these keys and no others:
- "score": number from 0 to 10 (decimals allowed)
- "strengths": array of exactly 3 non-empty strings
- "weaknesses": array of exactly 3 non-empty strings
- "detailed_feedback": one string with clear, specific, actionable feedback tied to the submission
- "hidden_talent_flag": boolean
- "hidden_talent_reason": string when hidden_talent_flag is true; otherwise null

Do not wrap the JSON in markdown code fences. Do not add commentary, labels, or any characters before or after the JSON object."""

SYSTEM_PROMPT_COMPARE = """You are an expert technical recruiter comparing two candidates on the same task and role.

Your entire reply MUST be a single JSON object with EXACTLY these keys and no others:
- "winner_id": string — must equal the winning candidate's candidate_id exactly as given
- "winner_name": string — full name of the winner as given
- "reasoning": string — why this candidate was chosen over the other
- "candidate_a_score": number from 0 to 10 for candidate A
- "candidate_b_score": number from 0 to 10 for candidate B
- "side_by_side": object whose keys are comparison dimensions (e.g. technical_depth, communication, problem_solving) and values are objects like {"a": "...", "b": "..."} or short strings per side as appropriate

Do not wrap the JSON in markdown. Do not add keys, comments, or text before or after the JSON object."""

SYSTEM_PROMPT_WHY_NOT = """You are a thoughtful recruiter explaining to a candidate why they were not selected, in a constructive and respectful tone.

Your entire reply MUST be a single JSON object with EXACTLY these keys and no others:
- "explanation": string — clear, honest explanation tied to the role and evaluation
- "improvement_areas": array of non-empty strings — concrete skills or behaviors to develop
- "encouragement": string — brief, genuine encouragement

Do not wrap the JSON in markdown. Do not add keys, comments, or text before or after the JSON object."""


class AIEvaluationEngine:
    """Evaluates submissions using the OpenAI Chat Completions API."""

    def __init__(self) -> None:
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set. Add it to your .env file.")
        self._client = AsyncOpenAI(api_key=api_key)

    @staticmethod
    def _filter_json_keys(data: dict[str, Any], allowed: frozenset[str]) -> dict[str, Any]:
        unknown = set(data.keys()) - allowed
        if unknown:
            logger.warning("Dropping unexpected keys from model output: %s", sorted(unknown))
        filtered = {k: data[k] for k in allowed if k in data}
        missing = allowed - set(filtered)
        if missing:
            raise ValueError(f"Model JSON missing required keys: {sorted(missing)}")
        return filtered

    def _format_submission_block(self, label: str, submission: SubmissionRequest) -> str:
        parts = [
            f"## {label}",
            f"Candidate ID: {submission.candidate_id}",
            f"Name: {submission.candidate_name}",
            f"Role: {submission.role.value}",
            f"Task ID: {submission.task_id}",
            "\n### Submission\n",
            submission.submission_text,
        ]
        if submission.resume_summary:
            parts.extend(["\n### Resume summary\n", submission.resume_summary])
        return "\n".join(parts)

    def _build_user_message_eval(self, submission: SubmissionRequest) -> str:
        return self._format_submission_block("Candidate", submission)

    def _build_user_message_compare(self, request: CompareRequest) -> str:
        return "\n\n".join(
            [
                self._format_submission_block("Candidate A", request.candidate_a),
                self._format_submission_block("Candidate B", request.candidate_b),
            ]
        )

    def _build_user_message_why_not(self, request: WhyNotSelectedRequest) -> str:
        return "\n".join(
            [
                f"Candidate ID: {request.candidate_id}",
                f"Name: {request.candidate_name}",
                f"Role: {request.role.value}",
                f"Score received: {request.score}",
                f"Strengths: {json.dumps(request.strengths)}",
                f"Weaknesses: {json.dumps(request.weaknesses)}",
                "\nExplain why this candidate was not selected for the role.",
            ]
        )

    def _parse_model_json(self, raw: str, allowed_keys: frozenset[str]) -> dict[str, Any]:
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as exc:
            logger.error("Invalid JSON from model: %s", raw[:500])
            raise ValueError("Model returned invalid JSON.") from exc

        if not isinstance(data, dict):
            raise ValueError("Model JSON must be an object.")

        return self._filter_json_keys(data, allowed_keys)

    async def _chat_json(
        self,
        *,
        system_prompt: str,
        user_message: str,
    ) -> str:
        try:
            response = await self._client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
            )
        except OpenAIError:
            logger.exception("OpenAI API error during chat.completions.create")
            raise

        content = response.choices[0].message.content
        if not content:
            raise RuntimeError("OpenAI returned an empty message.")
        return content

    async def _with_retries(
        self,
        operation: str,
        runner: Callable[[], Awaitable[T]],
    ) -> T:
        """Run ``runner`` up to ``1 + MAX_RETRIES`` times on retriable failures."""
        last_error: BaseException | None = None
        for attempt in range(1 + MAX_RETRIES):
            try:
                return await runner()
            except OpenAIError as exc:
                last_error = exc
                logger.warning(
                    "%s: OpenAIError on attempt %s/%s: %s",
                    operation,
                    attempt + 1,
                    1 + MAX_RETRIES,
                    exc,
                )
            except (ValueError, ValidationError, RuntimeError) as exc:
                last_error = exc
                logger.warning(
                    "%s: validation or parse error on attempt %s/%s: %s",
                    operation,
                    attempt + 1,
                    1 + MAX_RETRIES,
                    exc,
                )
            except Exception as exc:
                last_error = exc
                logger.exception(
                    "%s: unexpected error on attempt %s/%s",
                    operation,
                    attempt + 1,
                    1 + MAX_RETRIES,
                )

            if attempt < MAX_RETRIES:
                delay = 0.5 * (2**attempt)
                logger.info("%s: retrying in %.1fs", operation, delay)
                await asyncio.sleep(delay)

        assert last_error is not None
        if isinstance(last_error, Exception):
            raise last_error
        raise RuntimeError(f"{operation} failed after {1 + MAX_RETRIES} attempts")

    async def evaluate_submission(self, submission: SubmissionRequest) -> EvaluationResult:
        """Call the model and return a validated ``EvaluationResult`` for this submission."""

        async def _once() -> EvaluationResult:
            raw = await self._chat_json(
                system_prompt=SYSTEM_PROMPT_EVAL,
                user_message=self._build_user_message_eval(submission),
            )
            payload = self._parse_model_json(raw, _JSON_KEYS_EVAL)
            try:
                return EvaluationResult(candidate_id=submission.candidate_id, **payload)
            except ValidationError as exc:
                logger.error("EvaluationResult validation failed: %s", exc)
                raise ValueError("Model output did not match EvaluationResult schema.") from exc

        try:
            return await self._with_retries("evaluate_submission", _once)
        except OpenAIError:
            logger.error("evaluate_submission: exhausted retries after OpenAI errors")
            raise
        except (ValueError, ValidationError, RuntimeError) as exc:
            logger.error("evaluate_submission: exhausted retries: %s", exc)
            raise

    def _validate_compare_result(self, request: CompareRequest, result: CompareResult) -> None:
        ids = {request.candidate_a.candidate_id, request.candidate_b.candidate_id}
        if result.winner_id not in ids:
            raise ValueError(f"winner_id must be one of {ids}, got {result.winner_id!r}")
        id_to_name = {
            request.candidate_a.candidate_id: request.candidate_a.candidate_name,
            request.candidate_b.candidate_id: request.candidate_b.candidate_name,
        }
        if id_to_name.get(result.winner_id) != result.winner_name:
            raise ValueError("winner_name does not match the declared winner_id")

    async def compare_candidates(self, request: CompareRequest) -> CompareResult:
        """Compare two submissions and return a structured ``CompareResult``."""

        async def _once() -> CompareResult:
            raw = await self._chat_json(
                system_prompt=SYSTEM_PROMPT_COMPARE,
                user_message=self._build_user_message_compare(request),
            )
            payload = self._parse_model_json(raw, _JSON_KEYS_COMPARE)
            try:
                result = CompareResult(**payload)
            except ValidationError as exc:
                logger.error("CompareResult validation failed: %s", exc)
                raise ValueError("Model output did not match CompareResult schema.") from exc
            self._validate_compare_result(request, result)
            return result

        try:
            return await self._with_retries("compare_candidates", _once)
        except OpenAIError:
            logger.error("compare_candidates: exhausted retries after OpenAI errors")
            raise
        except (ValueError, ValidationError, RuntimeError) as exc:
            logger.error("compare_candidates: exhausted retries: %s", exc)
            raise

    async def why_not_selected(self, request: WhyNotSelectedRequest) -> WhyNotSelectedResult:
        """Generate a constructive explanation for a candidate who was not selected."""

        async def _once() -> WhyNotSelectedResult:
            raw = await self._chat_json(
                system_prompt=SYSTEM_PROMPT_WHY_NOT,
                user_message=self._build_user_message_why_not(request),
            )
            payload = self._parse_model_json(raw, _JSON_KEYS_WHY_NOT)
            try:
                return WhyNotSelectedResult(candidate_id=request.candidate_id, **payload)
            except ValidationError as exc:
                logger.error("WhyNotSelectedResult validation failed: %s", exc)
                raise ValueError("Model output did not match WhyNotSelectedResult schema.") from exc

        try:
            return await self._with_retries("why_not_selected", _once)
        except OpenAIError:
            logger.error("why_not_selected: exhausted retries after OpenAI errors")
            raise
        except (ValueError, ValidationError, RuntimeError) as exc:
            logger.error("why_not_selected: exhausted retries: %s", exc)
            raise
