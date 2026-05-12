from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, model_validator


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class Role(str, Enum):
    software_engineer = "software_engineer"
    data_analyst = "data_analyst"
    product_manager = "product_manager"


# ---------------------------------------------------------------------------
# Submission
# ---------------------------------------------------------------------------

class SubmissionRequest(BaseModel):
    candidate_id: str = Field(..., min_length=1, description="Unique identifier for the candidate")
    candidate_name: str = Field(..., min_length=1, max_length=200, description="Full name of the candidate")
    role: Role = Field(..., description="Role the candidate is applying for")
    task_id: str = Field(..., min_length=1, description="Identifier of the assigned task")
    submission_text: str = Field(..., min_length=10, description="Candidate's task submission content")
    resume_summary: Optional[str] = Field(default=None, max_length=2000, description="Optional resume summary")


# ---------------------------------------------------------------------------
# Evaluation
# ---------------------------------------------------------------------------

class EvaluationResult(BaseModel):
    candidate_id: str = Field(..., min_length=1)
    score: float = Field(..., ge=0.0, le=10.0, description="Evaluation score from 0 to 10")
    strengths: list[str] = Field(..., min_length=1, description="List of identified strengths")
    weaknesses: list[str] = Field(..., description="List of identified weaknesses")
    detailed_feedback: str = Field(..., min_length=1, description="Comprehensive AI-generated feedback")
    hidden_talent_flag: bool = Field(..., description="True if an exceptional hidden talent was detected")
    hidden_talent_reason: Optional[str] = Field(
        default=None,
        description="Explanation of the hidden talent (required when hidden_talent_flag is True)",
    )

    @model_validator(mode="after")
    def validate_hidden_talent_reason(self) -> "EvaluationResult":
        if self.hidden_talent_flag and not self.hidden_talent_reason:
            raise ValueError("hidden_talent_reason must be provided when hidden_talent_flag is True")
        if not self.hidden_talent_flag and self.hidden_talent_reason:
            raise ValueError("hidden_talent_reason should be None when hidden_talent_flag is False")
        return self


# ---------------------------------------------------------------------------
# Comparison
# ---------------------------------------------------------------------------

class CompareRequest(BaseModel):
    candidate_a: SubmissionRequest = Field(..., description="First candidate's submission")
    candidate_b: SubmissionRequest = Field(..., description="Second candidate's submission")

    @model_validator(mode="after")
    def validate_different_candidates(self) -> "CompareRequest":
        if self.candidate_a.candidate_id == self.candidate_b.candidate_id:
            raise ValueError("candidate_a and candidate_b must have different candidate_ids")
        return self


class CompareResult(BaseModel):
    winner_id: str = Field(..., description="candidate_id of the winning candidate")
    winner_name: str = Field(..., description="Full name of the winning candidate")
    reasoning: str = Field(..., min_length=1, description="Explanation of why the winner was chosen")
    candidate_a_score: float = Field(..., ge=0.0, le=10.0, description="Score for candidate A")
    candidate_b_score: float = Field(..., ge=0.0, le=10.0, description="Score for candidate B")
    side_by_side: dict = Field(
        ...,
        description="Structured side-by-side comparison keyed by dimension (e.g. 'technical_skills', 'communication')",
    )


# ---------------------------------------------------------------------------
# Why Not Selected
# ---------------------------------------------------------------------------

class WhyNotSelectedRequest(BaseModel):
    candidate_id: str = Field(..., min_length=1)
    candidate_name: str = Field(..., min_length=1, max_length=200)
    role: Role = Field(..., description="Role the candidate applied for")
    score: float = Field(..., ge=0.0, le=10.0, description="Final evaluation score received")
    strengths: list[str] = Field(..., min_length=1, description="Strengths identified during evaluation")
    weaknesses: list[str] = Field(..., min_length=1, description="Weaknesses identified during evaluation")


class WhyNotSelectedResult(BaseModel):
    candidate_id: str = Field(..., min_length=1)
    explanation: str = Field(..., min_length=1, description="Clear explanation of why the candidate was not selected")
    improvement_areas: list[str] = Field(..., min_length=1, description="Concrete areas the candidate should work on")
    encouragement: str = Field(..., min_length=1, description="Motivational closing message for the candidate")


# ---------------------------------------------------------------------------
# Generic error schema
# ---------------------------------------------------------------------------

class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
