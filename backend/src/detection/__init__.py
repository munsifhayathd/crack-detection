"""Crack detection algorithms and processing pipeline."""

from src.detection.classifier import (
    calculate_confidence,
    classify_crack_type,
    score_severity,
)
from src.detection.constants import CRACK_TYPES, LADYBUG_CSV_COLUMNS, SEVERITIES
from src.detection.csv_parser import (
    CsvParseError,
    extract_coordinates,
    parse_ladybug_csv,
    validate_row,
)
from src.detection.detector import CrackDetector
from src.detection.geo import utm_to_latlng
from src.detection.image_features import extract_features
from src.detection.pipeline import ProcessingPipeline
from src.detection.schemas import (
    CrackAnalysis,
    DetectionResult,
    GeoCoordinate,
    ImageFeatures,
    ProcessingSummary,
    SurveyRecord,
)

__all__ = [
    "CRACK_TYPES",
    "CsvParseError",
    "CrackAnalysis",
    "CrackDetector",
    "DetectionResult",
    "GeoCoordinate",
    "ImageFeatures",
    "LADYBUG_CSV_COLUMNS",
    "ProcessingPipeline",
    "ProcessingSummary",
    "SEVERITIES",
    "SurveyRecord",
    "calculate_confidence",
    "classify_crack_type",
    "extract_coordinates",
    "extract_features",
    "parse_ladybug_csv",
    "score_severity",
    "utm_to_latlng",
    "validate_row",
]
