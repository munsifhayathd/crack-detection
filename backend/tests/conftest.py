"""Shared pytest fixtures for crack detection tests."""

from __future__ import annotations

from pathlib import Path

import pytest

from src.detection.detector import CrackDetector
from src.detection.pipeline import ProcessingPipeline
from src.detection.schemas import SurveyRecord

FIXTURES_DIR = Path(__file__).parent / "fixtures"


@pytest.fixture
def fixtures_dir() -> Path:
    return FIXTURES_DIR


@pytest.fixture
def ladybug_sample_csv(fixtures_dir: Path) -> Path:
    return fixtures_dir / "ladybug_sample.csv"


@pytest.fixture
def ladybug_export_csv(fixtures_dir: Path) -> Path:
    return fixtures_dir / "ladybug_export.csv"


@pytest.fixture
def ladybug_sample_content(ladybug_sample_csv: Path) -> str:
    return ladybug_sample_csv.read_text(encoding="utf-8")


@pytest.fixture
def ladybug_export_content(ladybug_export_csv: Path) -> str:
    return ladybug_export_csv.read_text(encoding="utf-8")


@pytest.fixture
def sample_record() -> SurveyRecord:
    return SurveyRecord(
        timestamp="399332842.294712",
        filename="240509_233404483.jpg",
        easting=486247.625,
        northing=7039339.904,
        height=411.964,
        orientation={"Roll": 2.841209066, "Pitch": 0.301707875},
    )


@pytest.fixture
def synthetic_image_bytes() -> bytes:
    """Deterministic pseudo-image payload for repeatable detection tests."""
    return bytes((index * 17 + (index % 7) * 23) % 256 for index in range(512))


@pytest.fixture
def high_texture_image_bytes() -> bytes:
    """Byte pattern with strong gradients to exercise classification."""
    return bytes(255 if index % 2 == 0 else 0 for index in range(512))


@pytest.fixture
def low_signal_image_bytes() -> bytes:
    """Near-uniform payload representing a low-contrast surface."""
    return bytes([128] * 512)


@pytest.fixture
def detector() -> CrackDetector:
    return CrackDetector()


@pytest.fixture
def pipeline(detector: CrackDetector) -> ProcessingPipeline:
    return ProcessingPipeline(detector=detector)


@pytest.fixture
def image_loader_factory(synthetic_image_bytes: bytes):
    def factory(custom_bytes: bytes | None = None):
        payload = custom_bytes or synthetic_image_bytes

        def load_image(_record: SurveyRecord) -> bytes:
            return payload

        return load_image

    return factory


@pytest.fixture
def app_settings():
    """Provide test settings."""
    return {
        "APP_NAME": "Test App",
        "ENVIRONMENT": "testing",
    }
