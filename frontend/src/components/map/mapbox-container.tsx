"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useTheme } from "next-themes";
import { createRoot } from "react-dom/client";
import { mapboxConfig, SEVERITY_COLORS } from "@/lib/mapbox/config";
import { CrackDetailPopup } from "./crack-detail-popup";
import type { CrackResult } from "@/types";

interface MapboxContainerProps {
  results: CrackResult[];
}

export function MapboxContainer({ results }: MapboxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { theme } = useTheme();
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || !mapboxConfig.accessToken) return;

    mapboxgl.accessToken = mapboxConfig.accessToken;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style:
        theme === "dark"
          ? mapboxConfig.style.dark
          : mapboxConfig.style.light,
      center: mapboxConfig.defaultCenter,
      zoom: mapboxConfig.defaultZoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Update style on theme change
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const style =
      theme === "dark"
        ? mapboxConfig.style.dark
        : mapboxConfig.style.light;
    mapRef.current.setStyle(style);
  }, [theme, mapReady]);

  // Add/update markers
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (results.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();

    results.forEach((result) => {
      const color =
        SEVERITY_COLORS[(result.severity || "low").toLowerCase()] || "#888";

      // Create marker element
      const el = document.createElement("div");
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = color;
      el.style.border = "2px solid rgba(255,255,255,0.8)";
      el.style.boxShadow = `0 0 8px ${color}60`;
      el.style.cursor = "pointer";
      el.style.transition = "transform 0.15s ease";
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.4)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      // Create popup
      const popupContainer = document.createElement("div");
      const root = createRoot(popupContainer);
      root.render(<CrackDetailPopup result={result} />);

      const popup = new mapboxgl.Popup({
        offset: 12,
        closeButton: false,
        maxWidth: "none",
      }).setDOMContent(popupContainer);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([result.longitude, result.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
      bounds.extend([result.longitude, result.latitude]);
    });

    // Fit map to show all markers
    if (results.length > 1) {
      mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    } else {
      mapRef.current.flyTo({
        center: [results[0].longitude, results[0].latitude],
        zoom: 14,
      });
    }
  }, [results, mapReady]);

  if (!mapboxConfig.accessToken) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl bg-card ring-1 ring-border">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">Mapbox token not configured</p>
          <p className="text-xs text-muted-foreground font-mono">
            Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl ring-1 ring-border">
      <div ref={containerRef} className="h-full w-full" />
      {/* Results count overlay */}
      <div className="absolute bottom-4 left-4 rounded-lg bg-card/90 px-3 py-1.5 ring-1 ring-border backdrop-blur-sm">
        <span className="font-mono text-xs tabular-nums">
          {results.length} crack{results.length !== 1 ? "s" : ""} detected
        </span>
      </div>
    </div>
  );
}
