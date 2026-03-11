"use client";

import { MapPin, Calendar, Gauge, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CrackResult } from "@/types";
import { formatDistanceToNow } from "date-fns";

const severityClass: Record<string, string> = {
  Low: "severity-low",
  Medium: "severity-medium",
  High: "severity-high",
  Critical: "severity-critical",
};

interface CrackDetailPopupProps {
  result: CrackResult;
}

export function CrackDetailPopup({ result }: CrackDetailPopupProps) {
  return (
    <div className="w-64 overflow-hidden rounded-lg bg-card text-card-foreground">
      {/* Header with severity accent */}
      <div
        className={cn(
          "px-4 py-2.5",
          severityClass[result.severity || "Low"] || "severity-low"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {result.crack_type || "Unknown"}
          </span>
          <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase">
            {result.severity || "—"}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 p-4">
        {/* Coordinates */}
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-mono text-xs">
              {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Confidence */}
        {result.confidence !== null && (
          <div className="flex items-center gap-2">
            <Gauge className="size-3.5 shrink-0 text-muted-foreground" />
            <div className="flex flex-1 items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs tabular-nums">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Timestamp */}
        {result.timestamp && (
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(result.timestamp), {
                addSuffix: true,
              })}
            </span>
          </div>
        )}

        {/* Metadata */}
        {Object.keys(result.metadata).length > 0 && (
          <div className="flex items-start gap-2">
            <Tag className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {Object.entries(result.metadata).map(([key, val]) => (
                <span
                  key={key}
                  className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono"
                >
                  {key}: {String(val)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
