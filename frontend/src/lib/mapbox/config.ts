export const mapboxConfig = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
  defaultCenter: [115.8613, -31.9523] as [number, number], // Perth, WA
  defaultZoom: 12,
  style: {
    light: "mapbox://styles/mapbox/light-v11",
    dark: "mapbox://styles/mapbox/dark-v11",
  },
} as const;

export const SEVERITY_COLORS: Record<string, string> = {
  low: "#4ade80",
  medium: "#facc15",
  high: "#fb923c",
  critical: "#ef4444",
};
