import pytest
from backend.services.llama_service import evaluate_candidate_mock

def test_authenticity_perfect_match():
    # Arrange
    resume_skills = {"SQL": "Advanced"}
    submission_data = {
        "answer": "EXPLAIN QUERY PLAN SELECT * FROM users JOIN orders ON users.id = orders.user_id TRANSACTION rollback;"
    }
    
    # Act
    result = evaluate_candidate_mock(
        name="Perfect Matcher",
        role="Backend Engineer",
        submission_data=submission_data,
        resume_skills=resume_skills
    )
    
    # Assert
    assert result["skill_authenticity_score"] == 100.0
    assert result["proven_skills"]["SQL"] == "Advanced"
    assert not any("Overclaim" in gap for gap in result["authenticity_gaps"])

def test_authenticity_overclaim():
    # Arrange
    resume_skills = {"SQL": "Advanced"}
    submission_data = {
        "answer": "Simple text answer with no SQL keywords at all."
    }
    
    # Act
    result = evaluate_candidate_mock(
        name="Overclaimer",
        role="Backend Engineer",
        submission_data=submission_data,
        resume_skills=resume_skills
    )
    
    # Assert
    assert result["skill_authenticity_score"] < 100.0
    assert result["proven_skills"]["SQL"] == "Junior"
    assert any("Overclaim" in gap for gap in result["authenticity_gaps"])
    assert len(result["growth_nudges"]) > 0

def test_authenticity_underclaim_hidden_talent():
    # Arrange
    resume_skills = {"SQL": "Junior"}
    submission_data = {
        "answer": "EXPLAIN QUERY PLAN SELECT * FROM users JOIN orders ON users.id = orders.user_id TRANSACTION rollback;"
    }
    
    # Act
    result = evaluate_candidate_mock(
        name="Hidden Gem",
        role="Backend Engineer",
        submission_data=submission_data,
        resume_skills=resume_skills
    )
    
    # Assert
    assert result["skill_authenticity_score"] == 100.0 # No penalty for underclaiming!
    assert result["proven_skills"]["SQL"] == "Advanced"
    assert any("Underclaim" in gap for gap in result["authenticity_gaps"])
    assert any("Hidden Talent" in nudge for nudge in result["growth_nudges"])
