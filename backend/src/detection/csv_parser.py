"""Ladybug CSV parsing and validation."""

import csv
import io
from typing import Any

from src.detection.constants import LADYBUG_CSV_COLUMNS
from src.detection.schemas import SurveyRecord


class CsvParseError(ValueError):
    """Raised when CSV content cannot be parsed or validated."""


def _normalize_header(header: list[str]) -> list[str]:
    """Map Ladybug export headers to normalized column names."""
    normalized: list[str] = []
    for column in header:
        lower = column.strip().lower()
        if "timestamp" in lower:
            normalized.append("Timestamp")
        elif "filename" in lower:
            normalized.append("Filename")
        elif "direction" in lower and "easting" in lower:
            normalized.append("Direction_Easting")
        elif "easting" in lower:
            normalized.append("Easting")
        elif "northing" in lower:
            normalized.append("Northing")
        elif "height" in lower:
            normalized.append("Height")
        elif lower.startswith("direction") or "direction" in lower:
            normalized.append("Direction_Easting")
        elif "roll" in lower:
            normalized.append("Roll")
        elif "pitch" in lower:
            normalized.append("Pitch")
        elif "yaw" in lower:
            normalized.append("Yaw")
        elif "omega" in lower:
            normalized.append("Omega")
        elif "phi" in lower:
            normalized.append("Phi")
        elif "kappa" in lower:
            normalized.append("Kappa")
        else:
            normalized.append(column.strip())
    return normalized


def _parse_float(value: str, field_name: str, row_number: int) -> float:
    try:
        return float(value.strip())
    except (TypeError, ValueError) as exc:
        msg = f"Invalid numeric value for {field_name} on row {row_number}: {value!r}"
        raise CsvParseError(msg) from exc


def _row_to_record(row: dict[str, Any], row_number: int) -> SurveyRecord:
    required = ("Timestamp", "Filename", "Easting", "Northing", "Height")
    missing = [field for field in required if not str(row.get(field, "")).strip()]
    if missing:
        joined = ", ".join(missing)
        raise CsvParseError(f"Missing required fields on row {row_number}: {joined}")

    orientation_fields = ("Roll", "Pitch", "Yaw", "Omega", "Phi", "Kappa")
    orientation: dict[str, float] = {}
    for field in orientation_fields:
        raw = str(row.get(field, "")).strip()
        if raw:
            orientation[field] = _parse_float(raw, field, row_number)

    return SurveyRecord(
        timestamp=str(row["Timestamp"]).strip(),
        filename=str(row["Filename"]).strip(),
        easting=_parse_float(str(row["Easting"]), "Easting", row_number),
        northing=_parse_float(str(row["Northing"]), "Northing", row_number),
        height=_parse_float(str(row["Height"]), "Height", row_number),
        orientation=orientation,
    )


def validate_row(row: dict[str, Any], row_number: int = 1) -> SurveyRecord:
    """Validate a single CSV row and return a survey record."""
    return _row_to_record(row, row_number)


def parse_ladybug_csv(content: str) -> list[SurveyRecord]:
    """Parse Ladybug camera CSV export content into survey records."""
    if not content.strip():
        raise CsvParseError("CSV content is empty")

    reader = csv.reader(io.StringIO(content))
    try:
        raw_header = next(reader)
    except StopIteration as exc:
        raise CsvParseError("CSV content has no header row") from exc

    header = _normalize_header(raw_header)
    records: list[SurveyRecord] = []

    for row_number, raw_row in enumerate(reader, start=2):
        if not any(cell.strip() for cell in raw_row):
            continue

        if len(raw_row) < len(LADYBUG_CSV_COLUMNS):
            padded = raw_row + [""] * (len(LADYBUG_CSV_COLUMNS) - len(raw_row))
        else:
            padded = raw_row[: len(LADYBUG_CSV_COLUMNS)]

        row_dict = dict(zip(header, padded, strict=False))
        records.append(_row_to_record(row_dict, row_number))

    if not records:
        raise CsvParseError("CSV content contains no data rows")

    return records


def extract_coordinates(record: SurveyRecord) -> tuple[float, float, float]:
    """Return easting, northing, and height from a survey record."""
    return record.easting, record.northing, record.height
