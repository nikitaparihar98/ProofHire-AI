import pytest

from models.schemas import CompareRequest, Role, SubmissionRequest, WhyNotSelectedRequest


@pytest.mark.asyncio
async def test_evaluate_high_score(
    patched_engine,
    sample_submission_request: SubmissionRequest,
    mock_completion_json,
) -> None:
    engine, create_mock = patched_engine
    create_mock.return_value = mock_completion_json(
        {
            "score": 8.0,
            "strengths": ["Clear structure", "Strong problem decomposition", "Good edge-case thinking"],
            "weaknesses": ["Minor naming nit", "Could add tests", "Docs sparse"],
            "detailed_feedback": "Solid submission with strong technical depth.",
            "hidden_talent_flag": False,
            "hidden_talent_reason": None,
        }
    )

    result = await engine.evaluate_submission(sample_submission_request)

    assert result.score >= 7
    assert len(result.strengths) == 3
    create_mock.assert_awaited()


@pytest.mark.asyncio
async def test_evaluate_low_score(
    patched_engine,
    sample_submission_request: SubmissionRequest,
    mock_completion_json,
) -> None:
    engine, create_mock = patched_engine
    create_mock.return_value = mock_completion_json(
        {
            "score": 3.0,
            "strengths": ["On time", "Readable", "Honest scope"],
            "weaknesses": ["Very vague", "No concrete plan", "Generic copy-paste"],
            "detailed_feedback": "Does not address the task with enough specificity.",
            "hidden_talent_flag": False,
            "hidden_talent_reason": None,
        }
    )

    result = await engine.evaluate_submission(sample_submission_request)

    assert result.score <= 4


@pytest.mark.asyncio
async def test_hidden_talent_detection(
    patched_engine,
    sample_submission_request: SubmissionRequest,
    mock_completion_json,
) -> None:
    engine, create_mock = patched_engine
    submission = sample_submission_request.model_copy(
        update={"resume_summary": "self-taught bootcamp graduate"}
    )
    create_mock.return_value = mock_completion_json(
        {
            "score": 8.0,
            "strengths": ["One", "Two", "Three"],
            "weaknesses": ["W1", "W2", "W3"],
            "detailed_feedback": "Strong signals from non-traditional background.",
            "hidden_talent_flag": True,
            "hidden_talent_reason": "Resume indicates self-taught bootcamp path with strong submission quality.",
        }
    )

    result = await engine.evaluate_submission(submission)

    assert result.hidden_talent_flag is True
    assert result.score == 8.0


@pytest.mark.asyncio
async def test_comparison_picks_winner(patched_engine, mock_completion_json) -> None:
    engine, create_mock = patched_engine
    candidate_a = SubmissionRequest(
        candidate_id="cand-a",
        candidate_name="Alice",
        role=Role.data_analyst,
        task_id="t1",
        submission_text="Alice submission with enough characters for the schema minimum.",
    )
    candidate_b = SubmissionRequest(
        candidate_id="cand-b",
        candidate_name="Bob",
        role=Role.data_analyst,
        task_id="t1",
        submission_text="Bob submission with enough characters for the schema minimum here.",
    )
    req = CompareRequest(candidate_a=candidate_a, candidate_b=candidate_b)

    create_mock.return_value = mock_completion_json(
        {
            "winner_id": "cand-b",
            "winner_name": "Bob",
            "reasoning": "Bob showed deeper quantitative reasoning.",
            "candidate_a_score": 5.0,
            "candidate_b_score": 9.0,
            "side_by_side": {
                "analysis_depth": {"a": "surface", "b": "strong"},
                "communication": {"a": "ok", "b": "clearer"},
            },
        }
    )

    result = await engine.compare_candidates(req)

    assert result.candidate_b_score > result.candidate_a_score
    assert result.winner_id == "cand-b"


@pytest.mark.asyncio
async def test_why_not_selected_returns_explanation(patched_engine, mock_completion_json) -> None:
    engine, create_mock = patched_engine
    req = WhyNotSelectedRequest(
        candidate_id="cand-x",
        candidate_name="Chris",
        role=Role.product_manager,
        score=4.5,
        strengths=["Stakeholder empathy"],
        weaknesses=["Roadmap lacked metrics", "Prioritization unclear"],
    )
    create_mock.return_value = mock_completion_json(
        {
            "explanation": "The panel prioritized stronger evidence of metric-driven prioritization.",
            "improvement_areas": ["Define success metrics", "Sharpen prioritization framework"],
            "encouragement": "Your stakeholder sense is a real asset—keep building the analytical side.",
        }
    )

    result = await engine.why_not_selected(req)

    assert isinstance(result.explanation, str)
    assert len(result.explanation.strip()) > 0
