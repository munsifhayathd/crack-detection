"""Unit tests for the crack detector."""


from src.detection.constants import CRACK_TYPES, SEVERITIES
from src.detection.detector import CrackDetector


def test_detect_returns_processed_result_for_valid_image(
    detector: CrackDetector,
    synthetic_image_bytes: bytes,
) -> None:
    result = detector.detect(synthetic_image_bytes)
    assert result.status == "processed"
    assert result.crack_type in CRACK_TYPES
    assert result.severity in SEVERITIES
    assert 0.5 <= result.confidence <= 0.99
    assert result.error_message is None


def test_detect_fails_for_insufficient_image_data(detector: CrackDetector) -> None:
    result = detector.detect(b"short")
    assert result.status == "failed"
    assert result.crack_type is None
    assert result.severity is None
    assert result.confidence == 0.0
    assert result.error_message is not None


def test_detect_is_deterministic(
    detector: CrackDetector,
    synthetic_image_bytes: bytes,
) -> None:
    first = detector.detect(synthetic_image_bytes)
    second = detector.detect(synthetic_image_bytes)
    assert first == second


def test_extract_features_delegates_to_image_feature_helpers(
    detector: CrackDetector,
    synthetic_image_bytes: bytes,
) -> None:
    features = detector.extract_features(synthetic_image_bytes)
    assert features.byte_length == len(synthetic_image_bytes)
