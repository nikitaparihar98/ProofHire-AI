def calculate_overall_score(data):
    return (
        0.30 * data["problem_solving"] +
        0.25 * data["accuracy"] +
        0.20 * data["code_quality"] +
        0.15 * data["efficiency"] +
        0.10 * data["communication"]
    )