"""Unit tests for crack type and severity classification."""

import pytest

from src.detection.classifier import (
    calculate_confidence,
    classify_crack_type,
    score_severity,
)
from src.detection.constants import CRACK_TYPES, SEVERITIES
from src.detection.schemas import ImageFeatures


@pytest.mark.parametrize(
    "features",
    [
        ImageFeatures(512, 0.95, 0.90, 0.80),
        ImageFeatures(512, 0.10, 0.15, 0.45),
        ImageFeatures(512, 0.55, 0.40, 0.60),
    ],
)
def test_classify_crack_type_returns_valid_label(features: ImageFeatures) -> None:
    assert classify_crack_type(features) in CRACK_TYPES


@pytest.mark.parametrize(
    "features",
    [
        ImageFeatures(512, 0.95, 0.90, 0.80),
        ImageFeatures(512, 0.05, 0.05, 0.50),
    ],
)
def test_score_severity_returns_valid_band(features: ImageFeatures) -> None:
    assert score_severity(features) in SEVERITIES


def test_calculate_confidence_is_within_expected_range() -> None:
    features = ImageFeatures(512, 0.75, 0.65, 0.55)
    confidence = calculate_confidence(features)
    assert 0.5 <= confidence <= 0.99


def test_high_signal_features_yield_higher_confidence() -> None:
    high = ImageFeatures(512, 0.90, 0.85, 0.70)
    low = ImageFeatures(512, 0.05, 0.05, 0.50)
    assert calculate_confidence(high) > calculate_confidence(low)
