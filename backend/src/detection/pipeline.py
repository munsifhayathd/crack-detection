"""End-to-end crack detection processing pipeline."""

from collections.abc import Callable
from pathlib import Path
from time import perf_counter

from src.detection.csv_parser import parse_ladybug_csv
from src.detection.detector import CrackDetector
from src.detection.geo import utm_to_latlng
from src.detection.schemas import (
    CrackAnalysis,
    DetectionResult,
    ImageFeatures,
    ProcessingSummary,
    SurveyRecord,
)

ImageLoader = Callable[[SurveyRecord], bytes]


class ProcessingPipeline:
    """Coordinates CSV ingestion, geocoding, and crack detection."""

    def __init__(self, detector: CrackDetector | None = None) -> None:
        self.detector = detector or CrackDetector()

    def process_image(self, image_data: bytes) -> dict[str, str | float | None]:
        """Run detection and return a serializable result payload."""
        result = self.detector.detect(image_data)
        return {
            "crack_type": result.crack_type,
            "severity": result.severity,
            "confidence": result.confidence,
            "status": result.status,
            "error_message": result.error_message,
        }

    def process_record(
        self,
        record: SurveyRecord,
        image_index: int,
        image_loader: ImageLoader,
    ) -> CrackAnalysis:
        """Process one survey record through geocoding and detection."""
        coordinate = utm_to_latlng(record.easting, record.northing)
        try:
            image_data = image_loader(record)
        except OSError as exc:
            detection = DetectionResult(
                crack_type=None,
                severity=None,
                confidence=0.0,
                features=ImageFeatures(0, 0.0, 0.0, 0.5),
                status="failed",
                error_message=str(exc),
            )
        else:
            detection = self.detector.detect(image_data)

        return CrackAnalysis(
            record=record,
            coordinate=coordinate,
            detection=detection,
            image_index=image_index,
        )

    def process_batch(
        self,
        records: list[SurveyRecord],
        image_loader: ImageLoader,
    ) -> ProcessingSummary:
        """Process a batch of survey records."""
        analyses: list[CrackAnalysis] = []
        crack_types: dict[str, int] = {}
        severities: dict[str, int] = {}
        processed_count = 0
        failed_count = 0

        for index, record in enumerate(records):
            analysis = self.process_record(record, index, image_loader)
            analyses.append(analysis)

            if analysis.detection.status == "processed":
                processed_count += 1
                if analysis.detection.crack_type:
                    crack_types[analysis.detection.crack_type] = (
                        crack_types.get(analysis.detection.crack_type, 0) + 1
                    )
                if analysis.detection.severity:
                    severities[analysis.detection.severity] = (
                        severities.get(analysis.detection.severity, 0) + 1
                    )
            else:
                failed_count += 1

        return ProcessingSummary(
            total_images=len(records),
            processed_count=processed_count,
            failed_count=failed_count,
            analyses=analyses,
            crack_types=crack_types,
            severities=severities,
        )

    def run(
        self,
        csv_content: str,
        image_loader: ImageLoader,
    ) -> ProcessingSummary:
        """Parse CSV content and process all rows."""
        records = parse_ladybug_csv(csv_content)
        return self.process_batch(records, image_loader)

    def run_from_paths(
        self,
        csv_path: Path,
        image_directory: Path,
    ) -> ProcessingSummary:
        """Load CSV from disk and resolve images from a directory."""
        csv_content = csv_path.read_text(encoding="utf-8")

        def load_image(record: SurveyRecord) -> bytes:
            image_path = image_directory / record.filename
            return image_path.read_bytes()

        return self.run(csv_content, load_image)

    def benchmark(
        self,
        csv_content: str,
        image_loader: ImageLoader,
    ) -> tuple[ProcessingSummary, float]:
        """Run the pipeline and return elapsed wall time in seconds."""
        started = perf_counter()
        summary = self.run(csv_content, image_loader)
        elapsed = perf_counter() - started
        summary.metadata["elapsed_seconds"] = round(elapsed, 6)
        return summary, elapsed
