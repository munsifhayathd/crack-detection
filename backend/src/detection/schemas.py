"""Data models for crack detection pipeline."""

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class SurveyRecord:
    """Single row from a Ladybug camera CSV export."""

    timestamp: str
    filename: str
    easting: float
    northing: float
    height: float
    orientation: dict[str, float] = field(default_factory=dict)


@dataclass(frozen=True)
class ImageFeatures:
    """Feature vector extracted from a road surface image."""

    byte_length: int
    edge_density: float
    texture_variance: float
    orientation_score: float


@dataclass(frozen=True)
class DetectionResult:
    """Output of crack detection for one image."""

    crack_type: str | None
    severity: str | None
    confidence: float
    features: ImageFeatures
    status: str
    error_message: str | None = None


@dataclass(frozen=True)
class GeoCoordinate:
    """WGS84 latitude/longitude pair."""

    latitude: float
    longitude: float


@dataclass
class CrackAnalysis:
    """Combined survey metadata and detection output for one image."""

    record: SurveyRecord
    coordinate: GeoCoordinate
    detection: DetectionResult
    image_index: int


@dataclass
class ProcessingSummary:
    """Aggregate outcome of a batch processing run."""

    total_images: int
    processed_count: int
    failed_count: int
    analyses: list[CrackAnalysis] = field(default_factory=list)
    crack_types: dict[str, int] = field(default_factory=dict)
    severities: dict[str, int] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)
