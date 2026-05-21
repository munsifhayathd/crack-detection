"""Unit tests for image feature extraction."""

import pytest

from src.detection.image_features import (
    compute_edge_density,
    compute_orientation_score,
    compute_texture_variance,
    extract_features,
)


def test_compute_edge_density_detects_gradients(high_texture_image_bytes: bytes) -> None:
    density = compute_edge_density(high_texture_image_bytes)
    assert density > 0.9


def test_compute_edge_density_is_zero_for_uniform_payload(
    low_signal_image_bytes: bytes,
) -> None:
    density = compute_edge_density(low_signal_image_bytes)
    assert density == pytest.approx(0.0)


def test_compute_texture_variance_is_higher_for_high_texture(
    high_texture_image_bytes: bytes,
    low_signal_image_bytes: bytes,
) -> None:
    high = compute_texture_variance(high_texture_image_bytes)
    low = compute_texture_variance(low_signal_image_bytes)
    assert high > low


def test_compute_orientation_score_is_bounded(synthetic_image_bytes: bytes) -> None:
    score = compute_orientation_score(synthetic_image_bytes)
    assert 0.0 <= score <= 1.0


def test_extract_features_returns_complete_vector(synthetic_image_bytes: bytes) -> None:
    features = extract_features(synthetic_image_bytes)
    assert features.byte_length == len(synthetic_image_bytes)
    assert 0.0 <= features.edge_density <= 1.0
    assert 0.0 <= features.texture_variance <= 1.0
    assert 0.0 <= features.orientation_score <= 1.0
