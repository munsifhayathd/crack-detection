"""Geospatial helpers for survey coordinate conversion."""

import math

from src.detection.schemas import GeoCoordinate

K0 = 0.9996
A = 6378137.0
E = 0.0818191908
E2 = E * E
E_P2 = E2 / (1 - E2)


def _to_deg(radians: float) -> float:
    return (radians * 180.0) / math.pi


def utm_to_latlng(
    easting: float,
    northing: float,
    zone: int = 50,
    southern: bool = True,
) -> GeoCoordinate:
    """Convert UTM coordinates to WGS84 latitude/longitude."""
    x = easting - 500_000.0
    y = northing - 10_000_000.0 if southern else northing

    m = y / K0
    mu = m / (
        A
        * (
            1
            - E2 / 4
            - (3 * E2 * E2) / 64
            - (5 * E2 * E2 * E2) / 256
        )
    )

    e1 = (1 - math.sqrt(1 - E2)) / (1 + math.sqrt(1 - E2))

    phi1 = (
        mu
        + ((3 * e1) / 2 - (27 * e1**3) / 32) * math.sin(2 * mu)
        + ((21 * e1**2) / 16 - (55 * e1**4) / 32) * math.sin(4 * mu)
        + ((151 * e1**3) / 96) * math.sin(6 * mu)
    )

    sin_phi1 = math.sin(phi1)
    cos_phi1 = math.cos(phi1)
    tan_phi1 = math.tan(phi1)

    n1 = A / math.sqrt(1 - E2 * sin_phi1 * sin_phi1)
    t1 = tan_phi1 * tan_phi1
    c1 = E_P2 * cos_phi1 * cos_phi1
    r1 = (A * (1 - E2)) / (1 - E2 * sin_phi1 * sin_phi1) ** 1.5
    d = x / (n1 * K0)

    lat = phi1 - ((n1 * tan_phi1) / r1) * (
        (d * d) / 2
        - ((5 + 3 * t1 + 10 * c1 - 4 * c1 * c1 - 9 * E_P2) * d**4) / 24
        + (
            (61 + 90 * t1 + 298 * c1 + 45 * t1 * t1 - 252 * E_P2 - 3 * c1 * c1)
            * d**6
        )
        / 720
    )

    lng = (
        d
        - ((1 + 2 * t1 + c1) * d**3) / 6
        + (
            (5 - 2 * c1 + 28 * t1 - 3 * c1 * c1 + 8 * E_P2 + 24 * t1 * t1)
            * d**5
        )
        / 120
    ) / cos_phi1

    central_meridian = (zone - 1) * 6 - 180 + 3

    return GeoCoordinate(
        latitude=_to_deg(lat),
        longitude=_to_deg(lng) + central_meridian,
    )
