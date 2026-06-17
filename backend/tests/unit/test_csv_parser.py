"""Unit tests for Ladybug CSV parsing."""

import pytest

from src.detection.constants import LADYBUG_CSV_COLUMNS
from src.detection.csv_parser import (
    CsvParseError,
    extract_coordinates,
    parse_ladybug_csv,
    validate_row,
)


def test_parse_ladybug_csv_returns_expected_record_count(ladybug_sample_content: str) -> None:
    records = parse_ladybug_csv(ladybug_sample_content)
    assert len(records) == 3


def test_parse_ladybug_csv_maps_core_fields(sample_record) -> None:
    record = sample_record
    assert record.filename == "240509_233404483.jpg"
    assert record.easting == pytest.approx(486247.625)
    assert record.northing == pytest.approx(7039339.904)
    assert record.height == pytest.approx(411.964)


def test_parse_ladybug_export_header(ladybug_export_content: str) -> None:
    records = parse_ladybug_csv(ladybug_export_content)
    assert len(records) == 2
    assert records[0].filename.endswith(".jpg")


def test_validate_row_requires_core_fields() -> None:
    with pytest.raises(CsvParseError, match="Missing required fields"):
        validate_row({"Timestamp": "1", "Filename": "a.jpg"}, row_number=3)


def test_validate_row_rejects_invalid_numeric_values() -> None:
    with pytest.raises(CsvParseError, match="Invalid numeric value"):
        validate_row(
            {
                "Timestamp": "1",
                "Filename": "a.jpg",
                "Easting": "not-a-number",
                "Northing": "7039339.904",
                "Height": "411.964",
            },
            row_number=4,
        )


def test_parse_ladybug_csv_skips_blank_rows() -> None:
    content = (
        "Timestamp,Filename,Easting,Northing,Height\n"
        "1,a.jpg,1,2,3\n"
        ",,,,\n"
        "2,b.jpg,4,5,6\n"
    )
    records = parse_ladybug_csv(content)
    assert len(records) == 2


def test_parse_ladybug_csv_rejects_empty_content() -> None:
    with pytest.raises(CsvParseError, match="empty"):
        parse_ladybug_csv("   \n  ")


def test_extract_coordinates(sample_record) -> None:
    easting, northing, height = extract_coordinates(sample_record)
    assert easting == pytest.approx(486247.625)
    assert northing == pytest.approx(7039339.904)
    assert height == pytest.approx(411.964)


def test_ladybug_column_contract() -> None:
    assert len(LADYBUG_CSV_COLUMNS) == 12
