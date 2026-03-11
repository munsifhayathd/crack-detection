"use client";

import { useMemo } from "react";
import {
  FileSpreadsheet,
  MapPin,
  Mountain,
  Clock,
  Rows3,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useUploadStore } from "@/store/upload-store";
import { cn } from "@/lib/utils";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted mb-4">
        <FileSpreadsheet className="size-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No data loaded</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        Upload a CSV file first to browse and explore your survey data here.
      </p>
      <Link href="/upload" className="mt-4">
        <Button variant="outline" size="sm" className="gap-2">
          Go to Upload
          <ArrowUpRight className="size-3.5" />
        </Button>
      </Link>
    </div>
  );
}

export default function DataPage() {
  const { rows, headers, fileName, batch } = useUploadStore();

  const stats = useMemo(() => {
    if (rows.length === 0) return null;

    const eastingKey = headers.find((h) => h.includes("Easting"));
    const northingKey = headers.find((h) => h.includes("Northing"));
    const heightKey = headers.find((h) => h.includes("Height"));
    const timestampKey = headers.find((h) => h.toLowerCase() === "timestamp");

    const parse = (key: string | undefined) =>
      key ? rows.map((r) => parseFloat(r[key])).filter((v) => !isNaN(v)) : [];

    const eastings = parse(eastingKey);
    const northings = parse(northingKey);
    const heights = parse(heightKey);
    const timestamps = parse(timestampKey);

    const range = (arr: number[]) =>
      arr.length > 0 ? { min: Math.min(...arr), max: Math.max(...arr) } : null;

    return {
      easting: range(eastings),
      northing: range(northings),
      height: range(heights),
      timestamp: range(timestamps),
    };
  }, [rows, headers]);

  if (rows.length === 0) return <EmptyState />;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Data Explorer</h2>
          <p className="text-sm text-muted-foreground">
            Browse and explore loaded survey data
          </p>
        </div>
        <Badge variant="secondary" className="font-mono">
          {fileName}
        </Badge>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <div className="flex items-center gap-2 mb-2">
            <Rows3 className="size-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Total Rows
            </span>
          </div>
          <p className="font-mono text-2xl font-bold tabular-nums">
            {rows.length.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <div className="flex items-center gap-2 mb-2">
            <Rows3 className="size-4 text-severity-low" />
            <span className="text-xs font-medium text-muted-foreground">
              Processed
            </span>
          </div>
          <p className="font-mono text-2xl font-bold tabular-nums text-severity-low">
            {batch.processedRows}
          </p>
        </div>
        {stats?.height && (
          <div className="rounded-xl bg-card p-4 ring-1 ring-border">
            <div className="flex items-center gap-2 mb-2">
              <Mountain className="size-4 text-severity-medium" />
              <span className="text-xs font-medium text-muted-foreground">
                Height Range
              </span>
            </div>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {(stats.height.max - stats.height.min).toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground">m</span>
            </p>
          </div>
        )}
        {stats?.timestamp && (
          <div className="rounded-xl bg-card p-4 ring-1 ring-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="size-4 text-severity-low" />
              <span className="text-xs font-medium text-muted-foreground">
                Time Span
              </span>
            </div>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {((stats.timestamp.max - stats.timestamp.min) / 3600).toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground">h</span>
            </p>
          </div>
        )}
      </div>

      {/* GPS coverage */}
      {(stats?.easting || stats?.northing) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.easting && (
            <div className="rounded-xl bg-card p-4 ring-1 ring-border">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="size-4 text-primary" />
                <span className="text-sm font-medium">Easting Coverage</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="font-mono">{stats.easting.min.toFixed(1)}</span>
                <span className="font-mono">{stats.easting.max.toFixed(1)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full w-full rounded-full bg-primary/60" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Range: {(stats.easting.max - stats.easting.min).toFixed(1)}m
              </p>
            </div>
          )}
          {stats.northing && (
            <div className="rounded-xl bg-card p-4 ring-1 ring-border">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="size-4 text-severity-medium" />
                <span className="text-sm font-medium">Northing Coverage</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="font-mono">{stats.northing.min.toFixed(1)}</span>
                <span className="font-mono">{stats.northing.max.toFixed(1)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full w-full rounded-full bg-severity-medium/60" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Range: {(stats.northing.max - stats.northing.min).toFixed(1)}m
              </p>
            </div>
          )}
        </div>
      )}

      {/* Full data table */}
      <div className="rounded-xl bg-card ring-1 ring-border">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-sm font-semibold">All Data</h3>
          <span className="font-mono text-xs text-muted-foreground">
            {headers.length} columns &middot; {rows.length.toLocaleString()} rows
          </span>
        </div>
        <ScrollArea className="h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-border bg-muted/60 backdrop-blur">
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-12">
                    #
                  </th>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "transition-colors hover:bg-muted/20",
                      i < batch.processedRows && "bg-severity-low/5"
                    )}
                  >
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {i + 1}
                    </td>
                    {headers.map((h) => (
                      <td
                        key={h}
                        className="max-w-40 truncate px-3 py-2 font-mono text-xs whitespace-nowrap"
                      >
                        {row[h] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
