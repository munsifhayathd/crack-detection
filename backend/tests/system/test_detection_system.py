"""System tests for end-to-end crack detection in an isolated environment."""

import time
from pathlib import Path

import pytest

from src.detection.constants import CRACK_TYPES, SEVERITIES
from src.detection.pipeline import ProcessingPipeline
from src.detection.schemas import SurveyRecord


@pytest.fixture
def isolated_image_directory(tmp_path: Path, synthetic_image_bytes: bytes) -> Path:
    image_dir = tmp_path / "isolated-images"
    image_dir.mkdir()
    for filename in (
        "240509_233404483.jpg",
        "240509_233411049.jpg",
        "240509_233417616.jpg",
    ):
        (image_dir / filename).write_bytes(synthetic_image_bytes)
    return image_dir


def test_full_pipeline_from_csv_file_in_isolated_environment(
    pipeline: ProcessingPipeline,
    ladybug_sample_csv: Path,
    isolated_image_directory: Path,
) -> None:
    summary = pipeline.run_from_paths(ladybug_sample_csv, isolated_image_directory)

    assert summary.total_images == 3
    assert summary.processed_count == 3
    assert summary.failed_count == 0
    assert all(analysis.detection.crack_type in CRACK_TYPES for analysis in summary.analyses)
    assert all(analysis.detection.severity in SEVERITIES for analysis in summary.analyses)
    assert all(-90.0 < analysis.coordinate.latitude < 0.0 for analysis in summary.analyses)
    assert all(116.0 < analysis.coordinate.longitude < 117.0 for analysis in summary.analyses)


def test_full_pipeline_from_ladybug_export_header(
    pipeline: ProcessingPipeline,
    ladybug_export_csv: Path,
    tmp_path: Path,
    synthetic_image_bytes: bytes,
) -> None:
    image_dir = tmp_path / "export-images"
    image_dir.mkdir()
    for filename in ("240509_233404483.jpg", "240509_233411049.jpg"):
        (image_dir / filename).write_bytes(synthetic_image_bytes)

    summary = pipeline.run_from_paths(ladybug_export_csv, image_dir)

    assert summary.total_images == 2
    assert summary.processed_count == 2


def test_pipeline_benchmark_meets_isolated_environment_performance_target(
    pipeline: ProcessingPipeline,
    ladybug_sample_content: str,
    synthetic_image_bytes: bytes,
) -> None:
    def load_image(_record: SurveyRecord) -> bytes:
        return synthetic_image_bytes

    summary, elapsed = pipeline.benchmark(ladybug_sample_content, load_image)

    assert summary.processed_count == 3
    assert elapsed < 1.0
    assert "elapsed_seconds" in summary.metadata


def test_pipeline_processes_large_batch_within_performance_budget(
    pipeline: ProcessingPipeline,
    synthetic_image_bytes: bytes,
) -> None:
    records = [
        SurveyRecord(
            timestamp=str(index),
            filename=f"image_{index:04d}.jpg",
            easting=486247.625 + index * 0.01,
            northing=7039339.904 + index * 0.01,
            height=411.964,
        )
        for index in range(100)
    ]

    def load_image(_record: SurveyRecord) -> bytes:
        return synthetic_image_bytes

    started = time.perf_counter()
    summary = pipeline.process_batch(records, load_image)
    elapsed = time.perf_counter() - started

    assert summary.total_images == 100
    assert summary.processed_count == 100
    assert elapsed < 2.0
