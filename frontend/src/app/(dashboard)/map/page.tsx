"use client";

import { useState } from "react";
import { Filter, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapboxContainer } from "@/components/map/mapbox-container";
import { cn } from "@/lib/utils";
import { mockResults } from "@/lib/mock-data";
import type { CrackResult } from "@/types";

const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"];
const severityClass: Record<string, string> = {
  Low: "severity-low",
  Medium: "severity-medium",
  High: "severity-high",
  Critical: "severity-critical",
};

export default function MapPage() {
  const [selectedSeverities, setSelectedSeverities] = useState<Set<string>>(
    new Set(SEVERITY_LEVELS)
  );
  const [showPanel, setShowPanel] = useState(false);

  const filteredResults = mockResults.filter(
    (r) => r.severity && selectedSeverities.has(r.severity)
  );

  const toggleSeverity = (severity: string) => {
    setSelectedSeverities((prev) => {
      const next = new Set(prev);
      if (next.has(severity)) {
        next.delete(severity);
      } else {
        next.add(severity);
      }
      return next;
    });
  };

  return (
    <div className="flex h-[calc(100vh-7.5rem)] gap-4 animate-fade-up">
      {/* Map */}
      <div className="flex-1">
        <MapboxContainer results={filteredResults} />
      </div>

      {/* Side panel (desktop) / floating panel (mobile) */}
      <div
        className={cn(
          "w-72 shrink-0 space-y-4 overflow-y-auto transition-all duration-300",
          "hidden lg:block"
        )}
      >
        {/* Severity filters */}
        <div className="rounded-xl bg-card ring-1 ring-border">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Filter className="size-3.5 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">
              Severity Filter
            </h3>
          </div>
          <div className="space-y-1.5 p-3">
            {SEVERITY_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => toggleSeverity(level)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all",
                  selectedSeverities.has(level)
                    ? "bg-muted/50"
                    : "opacity-40"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "size-2.5 rounded-full transition-transform",
                      selectedSeverities.has(level)
                        ? "scale-100"
                        : "scale-75"
                    )}
                    style={{
                      backgroundColor:
                        level === "Low"
                          ? "#4ade80"
                          : level === "Medium"
                          ? "#facc15"
                          : level === "High"
                          ? "#fb923c"
                          : "#ef4444",
                    }}
                  />
                  <span>{level}</span>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {mockResults.filter((r) => r.severity === level).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results list */}
        <div className="rounded-xl bg-card ring-1 ring-border">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <List className="size-3.5 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">
              Detections
            </h3>
            <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
              {filteredResults.length}
            </span>
          </div>
          <div className="max-h-[calc(100vh-22rem)] divide-y divide-border overflow-y-auto">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="group cursor-pointer px-4 py-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">
                      {result.crack_type || "Unknown"}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {result.latitude.toFixed(4)},{" "}
                      {result.longitude.toFixed(4)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                      severityClass[result.severity || "Low"]
                    )}
                  >
                    {result.severity}
                  </span>
                </div>
                {result.confidence !== null && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/60"
                        style={{
                          width: `${(result.confidence || 0) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[9px] tabular-nums text-muted-foreground">
                      {Math.round((result.confidence || 0) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-50 size-12 rounded-full shadow-lg lg:hidden"
        onClick={() => setShowPanel(!showPanel)}
      >
        {showPanel ? <X className="size-5" /> : <Filter className="size-5" />}
      </Button>
    </div>
  );
}
