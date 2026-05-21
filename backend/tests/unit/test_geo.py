"""Unit tests for UTM to WGS84 conversion."""

import pytest

from src.detection.geo import utm_to_latlng


def test_utm_to_latlng_perth_sample_coordinates() -> None:
    coordinate = utm_to_latlng(486247.625, 7039339.904, zone=50, southern=True)
    assert coordinate.latitude == pytest.approx(-26.7672, abs=0.001)
    assert coordinate.longitude == pytest.approx(116.8617, abs=0.001)


def test_utm_to_latlng_northern_hemisphere_differs_from_southern() -> None:
    southern = utm_to_latlng(500000.0, 7039339.904, southern=True)
    northern = utm_to_latlng(500000.0, 7039339.904, southern=False)
    assert southern.latitude != pytest.approx(northern.latitude)


@pytest.mark.parametrize(
    ("easting", "northing"),
    [
        (486247.625, 7039339.904),
        (486247.624, 7039339.903),
        (500000.0, 7000000.0),
    ],
)
def test_utm_to_latlng_returns_finite_coordinates(easting: float, northing: float) -> None:
    coordinate = utm_to_latlng(easting, northing)
    assert -90.0 <= coordinate.latitude <= 90.0
    assert -180.0 <= coordinate.longitude <= 180.0
