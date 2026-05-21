"""Crack detection orchestration for individual images."""

from src.detection.classifier import (
    calculate_confidence,
    classify_crack_type,
    score_severity,
)
from src.detection.image_features import extract_features
from src.detection.schemas import DetectionResult, ImageFeatures


class CrackDetector:
    """Prototype crack detector operating on raw image bytes."""

    minimum_image_bytes: int = 32

    def extract_features(self, image_data: bytes) -> ImageFeatures:
        """Extract feature vector from image bytes."""
        return extract_features(image_data)

    def detect(self, image_data: bytes) -> DetectionResult:
        """Run crack detection on a single image."""
        if len(image_data) < self.minimum_image_bytes:
            return DetectionResult(
                crack_type=None,
                severity=None,
                confidence=0.0,
                features=ImageFeatures(0, 0.0, 0.0, 0.5),
                status="failed",
                error_message=(
                    f"Image data too small for analysis "
                    f"(minimum {self.minimum_image_bytes} bytes)"
                ),
            )

        features = self.extract_features(image_data)
        return DetectionResult(
            crack_type=classify_crack_type(features),
            severity=score_severity(features),
            confidence=calculate_confidence(features),
            features=features,
            status="processed",
        )
