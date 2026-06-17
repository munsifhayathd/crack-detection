"""Integration tests for crack detection component interactions."""

from pathlib import Path

import pytest

from src.detection.csv_parser import parse_ladybug_csv
from src.detection.geo import utm_to_latlng
from src.detection.pipeline import ProcessingPipeline
from src.detection.schemas import SurveyRecord


def test_csv_to_geo_conversion_flow(ladybug_sample_content: str) -> None:
    records = parse_ladybug_csv(ladybug_sample_content)
    coordinates = [utm_to_latlng(record.easting, record.northing) for record in records]

    assert len(coordinates) == len(records)
    for coordinate in coordinates:
        assert -90.0 < coordinate.latitude < 0.0
        assert 116.0 < coordinate.longitude < 117.0


def test_detector_to_pipeline_result_shape(
    pipeline: ProcessingPipeline,
    synthetic_image_bytes: bytes,
) -> None:
    payload = pipeline.process_image(synthetic_image_bytes)
    assert set(payload.keys()) == {
        "crack_type",
        "severity",
        "confidence",
        "status",
        "error_message",
    }
    assert payload["status"] == "processed"


def test_process_record_combines_metadata_and_detection(
    pipeline: ProcessingPipeline,
    sample_record: SurveyRecord,
    synthetic_image_bytes: bytes,
) -> None:
    def load_image(_record: SurveyRecord) -> bytes:
        return synthetic_image_bytes

    analysis = pipeline.process_record(sample_record, image_index=0, image_loader=load_image)

    assert analysis.image_index == 0
    assert analysis.record.filename == sample_record.filename
    assert analysis.coordinate.latitude == pytest.approx(-26.7672, abs=0.001)
    assert analysis.coordinate.longitude == pytest.approx(116.8617, abs=0.001)
    assert analysis.detection.status == "processed"


def test_process_batch_aggregates_crack_and_severity_counts(
    pipeline: ProcessingPipeline,
    ladybug_sample_content: str,
    synthetic_image_bytes: bytes,
) -> None:
    records = parse_ladybug_csv(ladybug_sample_content)

    def load_image(_record: SurveyRecord) -> bytes:
        return synthetic_image_bytes

    summary = pipeline.process_batch(records, load_image)

    assert summary.total_images == len(records)
    assert summary.processed_count + summary.failed_count == summary.total_images
    assert len(summary.analyses) == len(records)
    assert sum(summary.crack_types.values()) == summary.processed_count
    assert sum(summary.severities.values()) == summary.processed_count


def test_pipeline_marks_missing_images_as_failed(
    pipeline: ProcessingPipeline,
    ladybug_sample_content: str,
) -> None:
    records = parse_ladybug_csv(ladybug_sample_content)

    def missing_image_loader(_record: SurveyRecord) -> bytes:
        raise FileNotFoundError("Image not found")

    summary = pipeline.process_batch(records, missing_image_loader)
    assert summary.failed_count == len(records)
    assert summary.processed_count == 0


def test_run_from_paths_with_synthetic_image_directory(
    pipeline: ProcessingPipeline,
    ladybug_sample_csv: Path,
    synthetic_image_bytes: bytes,
    tmp_path: Path,
) -> None:
    image_dir = tmp_path / "images"
    image_dir.mkdir()

    for filename in (
        "240509_233404483.jpg",
        "240509_233411049.jpg",
        "240509_233417616.jpg",
    ):
        (image_dir / filename).write_bytes(synthetic_image_bytes)

    summary = pipeline.run_from_paths(ladybug_sample_csv, image_dir)

    assert summary.total_images == 3
    assert summary.processed_count == 3
    assert summary.failed_count == 0
