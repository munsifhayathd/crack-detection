"""Crack detection domain constants."""

CRACK_TYPES: tuple[str, ...] = (
    "Longitudinal",
    "Transverse",
    "Alligator",
    "Block",
    "Edge",
    "Reflective",
)

SEVERITIES: tuple[str, ...] = (
    "Low",
    "Medium",
    "High",
    "Critical",
)

LADYBUG_CSV_COLUMNS: tuple[str, ...] = (
    "Timestamp",
    "Filename",
    "Easting",
    "Northing",
    "Height",
    "Direction_Easting",
    "Roll",
    "Pitch",
    "Yaw",
    "Omega",
    "Phi",
    "Kappa",
)
