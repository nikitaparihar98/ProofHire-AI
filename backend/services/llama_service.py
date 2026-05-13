import json
from typing import Dict, Any

def evaluate_candidate_mock(name: str, role: str, submission_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mock function to simulate calling the Llama API for candidate evaluation.
    In a real scenario, this would send submission_data to Llama API
    and parse the JSON response.
    """
    
    # This is a dummy response simulating AI analysis
    # Later, you will replace this with an actual HTTP request to Llama API.
    # e.g., requests.post("https://api.llama.ai/v1/chat/completions", headers=...)
    
    mock_response = {
        "overall_score": 85.5,
        "strengths": [
            "Strong understanding of React component lifecycle",
            "Clean and modular code structure",
            "Good use of Tailwind utility classes"
        ] if "frontend" in role.lower() else [
            "Solid API design principles",
            "Efficient database queries",
            "Good error handling"
        ],
        "weaknesses": [
            "Could improve accessibility (a11y) standards",
            "Lacks unit tests"
        ],
        "hiring_recommendation": "Strong Hire",
        "ai_feedback": f"{name} demonstrated excellent problem-solving skills in the {role} assignment. The implementation was robust, though there's room for improvement in writing automated tests.",
        "plagiarism_score": 12.5,
        "originality_score": 87.5,
        "plagiarism_risk_level": "Low",
        "ai_generated_suspicion": 15.0,
        "authenticity_summary": "The submission appears highly original with minimal overlap with common online solutions. No significant AI generation detected.",
        "malpractice_flags": []
    }
    
    return mock_response
