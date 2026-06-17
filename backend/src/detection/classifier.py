"""Crack type and severity classification from image features."""

from src.detection.constants import CRACK_TYPES, SEVERITIES
from src.detection.schemas import ImageFeatures


def classify_crack_type(features: ImageFeatures) -> str:
    """Map extracted features to a crack morphology label."""
    score = (
        features.edge_density * 0.45
        + features.texture_variance * 0.35
        + features.orientation_score * 0.20
    )
    index = int(score * len(CRACK_TYPES)) % len(CRACK_TYPES)
    return CRACK_TYPES[index]


def score_severity(features: ImageFeatures) -> str:
    """Map extracted features to a severity band."""
    severity_index = int(
        (features.edge_density * 0.6 + features.texture_variance * 0.4)
        * len(SEVERITIES)
    )
    severity_index = min(max(severity_index, 0), len(SEVERITIES) - 1)
    return SEVERITIES[severity_index]


def calculate_confidence(features: ImageFeatures) -> float:
    """Return a normalized confidence score in [0.5, 0.99]."""
    signal = (
        features.edge_density * 0.4
        + features.texture_variance * 0.4
        + abs(features.orientation_score - 0.5) * 0.2
    )
    return round(0.5 + min(max(signal, 0.0), 0.49), 4)
