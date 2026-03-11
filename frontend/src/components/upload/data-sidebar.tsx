"use client";

import {
  FileSpreadsheet,
  MapPin,
  Clock,
  Mountain,
  Rows3,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CsvRow } from "@/types";

interface DataSidebarProps {
  fileName: string;
  headers: string[];
  rows: CsvRow[];
  selectedCount: number;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

function StatCard({ icon: Icon, label, value, sub, color = "text-primary" }: StatCardProps) {
  return (
    <div className="rounded-lg bg-muted/30 p-3 space-y-1">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3.5", color)} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="font-mono text-sm font-semibold tabular-nums">{value}</p>
      {sub && (
        <p className="text-[10px] text-muted-foreground truncate">{sub}</p>
      )}
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? (
          <ChevronDown className="size-3" />
        ) : (
          <ChevronRight className="size-3" />
        )}
        {title}
      </button>
      {open && children}
    </div>
  );
}

export function DataSidebar({
  fileName,
  headers,
  rows,
  selectedCount,
}: DataSidebarProps) {
  const stats = useMemo(() => {
    if (rows.length === 0) return null;

    // Find coordinate columns
    const eastingKey = headers.find((h) => h.includes("Easting"));
    const northingKey = headers.find((h) => h.includes("Northing"));
    const heightKey = headers.find((h) => h.includes("Height"));
    const timestampKey = headers.find(
      (h) => h.toLowerCase() === "timestamp"
    );
    const filenameKey = headers.find(
      (h) => h.toLowerCase() === "filename"
    );

    // Parse numeric ranges
    const eastings = eastingKey
      ? rows.map((r) => parseFloat(r[eastingKey])).filter((v) => !isNaN(v))
      : [];
    const northings = northingKey
      ? rows.map((r) => parseFloat(r[northingKey])).filter((v) => !isNaN(v))
      : [];
    const heights = heightKey
      ? rows.map((r) => parseFloat(r[heightKey])).filter((v) => !isNaN(v))
      : [];
    const timestamps = timestampKey
      ? rows.map((r) => parseFloat(r[timestampKey])).filter((v) => !isNaN(v))
      : [];

    return {
      eastingRange:
        eastings.length > 0
          ? {
              min: Math.min(...eastings),
              max: Math.max(...eastings),
            }
          : null,
      northingRange:
        northings.length > 0
          ? {
              min: Math.min(...northings),
              max: Math.max(...northings),
            }
          : null,
      heightRange:
        heights.length > 0
          ? {
              min: Math.min(...heights),
              max: Math.max(...heights),
            }
          : null,
      timestampRange:
        timestamps.length > 0
          ? {
              min: Math.min(...timestamps),
              max: Math.max(...timestamps),
            }
          : null,
      firstFile: filenameKey ? rows[0]?.[filenameKey] : null,
      lastFile: filenameKey ? rows[rows.length - 1]?.[filenameKey] : null,
    };
  }, [rows, headers]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-border">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
            <FileSpreadsheet className="size-3.5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{fileName}</p>
            <p className="text-[10px] text-muted-foreground">
              {rows.length.toLocaleString()} rows &middot; {headers.length} columns
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Selection badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {selectedCount} / {rows.length} selected
            </Badge>
          </div>

          {/* Overview stats */}
          <CollapsibleSection title="Overview">
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                icon={Rows3}
                label="Total Rows"
                value={rows.length.toLocaleString()}
              />
              <StatCard
                icon={Rows3}
                label="Columns"
                value={headers.length}
              />
              {stats?.heightRange && (
                <StatCard
                  icon={Mountain}
                  label="Height Range"
                  value={`${stats.heightRange.min.toFixed(0)}–${stats.heightRange.max.toFixed(0)}m`}
                  color="text-severity-medium"
                />
              )}
              {stats?.timestampRange && (
                <StatCard
                  icon={Clock}
                  label="Time Span"
                  value={`${((stats.timestampRange.max - stats.timestampRange.min) / 3600).toFixed(1)}h`}
                  color="text-severity-low"
                />
              )}
            </div>
          </CollapsibleSection>

          {/* Coordinate ranges */}
          {(stats?.eastingRange || stats?.northingRange) && (
            <CollapsibleSection title="GPS Coverage">
              <div className="space-y-2">
                {stats?.eastingRange && (
                  <div className="rounded-lg bg-muted/20 px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="size-3 text-primary" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Easting
                      </span>
                    </div>
                    <p className="font-mono text-xs tabular-nums">
                      {stats.eastingRange.min.toFixed(1)} &rarr;{" "}
                      {stats.eastingRange.max.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Range:{" "}
                      {(stats.eastingRange.max - stats.eastingRange.min).toFixed(1)}m
                    </p>
                  </div>
                )}
                {stats?.northingRange && (
                  <div className="rounded-lg bg-muted/20 px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="size-3 text-severity-medium" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Northing
                      </span>
                    </div>
                    <p className="font-mono text-xs tabular-nums">
                      {stats.northingRange.min.toFixed(1)} &rarr;{" "}
                      {stats.northingRange.max.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Range:{" "}
                      {(stats.northingRange.max - stats.northingRange.min).toFixed(1)}m
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Columns list */}
          <CollapsibleSection title="Columns" defaultOpen={false}>
            <div className="space-y-1">
              {headers.map((h, i) => (
                <div
                  key={h}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted/30 transition-colors"
                >
                  <span className="font-mono text-[10px] text-muted-foreground w-4 text-right">
                    {i + 1}
                  </span>
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* File range */}
          {stats?.firstFile && (
            <CollapsibleSection title="Image Files" defaultOpen={false}>
              <div className="space-y-1.5 text-xs">
                <div className="rounded-md bg-muted/20 px-2.5 py-1.5">
                  <span className="text-muted-foreground">First: </span>
                  <span className="font-mono">{stats.firstFile}</span>
                </div>
                <div className="rounded-md bg-muted/20 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Last: </span>
                  <span className="font-mono">{stats.lastFile}</span>
                </div>
              </div>
            </CollapsibleSection>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
