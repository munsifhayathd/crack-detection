/**
 * Convert UTM coordinates to WGS84 Latitude/Longitude.
 * Uses simplified Karney-style inverse projection for zone 50S (Perth, WA area).
 */

const K0 = 0.9996;
const A = 6378137; // WGS84 semi-major axis
const E = 0.0818191908; // eccentricity
const E2 = E * E;
const E_P2 = E2 / (1 - E2);

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export function utmToLatLng(
  easting: number,
  northing: number,
  zone: number = 50,
  southern: boolean = true
): { lat: number; lng: number } {
  const x = easting - 500000;
  const y = southern ? northing - 10000000 : northing;

  const M = y / K0;
  const mu =
    M /
    (A *
      (1 -
        E2 / 4 -
        (3 * E2 * E2) / 64 -
        (5 * E2 * E2 * E2) / 256));

  const e1 = (1 - Math.sqrt(1 - E2)) / (1 + Math.sqrt(1 - E2));

  const phi1 =
    mu +
    ((3 * e1) / 2 - (27 * e1 * e1 * e1) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * e1 * e1 * e1 * e1) / 32) *
      Math.sin(4 * mu) +
    ((151 * e1 * e1 * e1) / 96) * Math.sin(6 * mu);

  const N1 = A / Math.sqrt(1 - E2 * Math.sin(phi1) * Math.sin(phi1));
  const T1 = Math.tan(phi1) * Math.tan(phi1);
  const C1 = E_P2 * Math.cos(phi1) * Math.cos(phi1);
  const R1 =
    (A * (1 - E2)) /
    Math.pow(1 - E2 * Math.sin(phi1) * Math.sin(phi1), 1.5);
  const D = x / (N1 * K0);

  const lat =
    phi1 -
    ((N1 * Math.tan(phi1)) / R1) *
      ((D * D) / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * E_P2) * D * D * D * D) /
          24 +
        ((61 +
          90 * T1 +
          298 * C1 +
          45 * T1 * T1 -
          252 * E_P2 -
          3 * C1 * C1) *
          D *
          D *
          D *
          D *
          D *
          D) /
          720);

  const lng =
    (D -
      ((1 + 2 * T1 + C1) * D * D * D) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * E_P2 + 24 * T1 * T1) *
        D *
        D *
        D *
        D *
        D) /
        120) /
    Math.cos(phi1);

  const centralMeridian = (zone - 1) * 6 - 180 + 3;

  return {
    lat: toDeg(lat),
    lng: toDeg(lng) + centralMeridian,
  };
}
