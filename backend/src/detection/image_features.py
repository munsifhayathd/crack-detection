"""Image feature extraction for crack detection."""

from src.detection.schemas import ImageFeatures


def _clamp(value: float, lower: float = 0.0, upper: float = 1.0) -> float:
    return max(lower, min(upper, value))


def compute_edge_density(image_data: bytes) -> float:
    """Estimate edge density from adjacent byte gradients."""
    if len(image_data) < 2:
        return 0.0

    edge_count = 0
    for index in range(1, len(image_data)):
        if abs(image_data[index] - image_data[index - 1]) >= 32:
            edge_count += 1

    return _clamp(edge_count / (len(image_data) - 1))


def compute_texture_variance(image_data: bytes, chunk_size: int = 64) -> float:
    """Estimate texture variance using byte-value spread within chunks."""
    if not image_data:
        return 0.0

    chunk_variances: list[float] = []
    for start in range(0, len(image_data), chunk_size):
        chunk = image_data[start : start + chunk_size]
        if len(chunk) < 2:
            continue
        mean = sum(chunk) / len(chunk)
        variance = sum((byte - mean) ** 2 for byte in chunk) / len(chunk)
        chunk_variances.append(variance)

    if not chunk_variances:
        return 0.0

    average_variance = sum(chunk_variances) / len(chunk_variances)
    return _clamp(average_variance / 65025.0)


def compute_orientation_score(image_data: bytes) -> float:
    """Estimate dominant crack orientation from horizontal vs vertical gradients."""
    if len(image_data) < 3:
        return 0.5

    horizontal = 0
    vertical = 0
    width = max(8, int(len(image_data) ** 0.5))

    for index in range(width, len(image_data)):
        horizontal += abs(image_data[index] - image_data[index - 1])
        vertical += abs(image_data[index] - image_data[index - width])

    total = horizontal + vertical
    if total == 0:
        return 0.5

    return _clamp(horizontal / total)


def extract_features(image_data: bytes) -> ImageFeatures:
    """Extract crack-relevant features from raw image bytes."""
    return ImageFeatures(
        byte_length=len(image_data),
        edge_density=compute_edge_density(image_data),
        texture_variance=compute_texture_variance(image_data),
        orientation_score=compute_orientation_score(image_data),
    )
