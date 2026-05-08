"use client";

import type { ElementType, ReactNode } from "react";
import { use, useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  FileUp,
  Flag,
  Layers,
  MapPin,
  Sparkles,
  Timer,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { MockPortfolioJob } from "@/data/mock-portfolio-jobs";
import { getMockPortfolioJobById } from "@/data/mock-portfolio-jobs";
import { cn } from "@/lib/utils";
import type { ProcessingJob } from "@/types";

const statusConfig: Record<
  ProcessingJob["status"],
  { label: string; class: string }
> = {
  pending: { label: "Pending", class: "status-pending" },
  processing: { label: "Processing", class: "status-processing" },
  completed: { label: "Completed", class: "status-completed" },
  failed: { label: "Failed", class: "status-failed" },
};

type DetailTabId = "overview" | "images" | "severity" | "activity";

type ThumbSeverity = "low" | "medium" | "high" | "critical";

function PortfolioKpiTile({
  label,
  value,
  icon: Icon,
  accent,
  delay,
}: {
  label: string;
  value: ReactNode;
  icon: ElementType;
  accent: string;
  delay: number;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-card p-5 ring-1 ring-border transition-all hover:ring-2 hover:ring-primary/30"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight font-mono tabular-nums">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
            accent
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] w-full opacity-60",
          accent.replace("bg-", "bg-").replace("/15", "")
        )}
      />
    </div>
  );
}

function totalDetections(job: MockPortfolioJob): number {
  const { low, medium, high, critical } = job.severityCounts;
  return low + medium + high + critical;
}

function buildImageThumbs(job: MockPortfolioJob): {
  seed: string;
  severity: ThumbSeverity;
  confidence: number;
}[] {
  const cycle: ThumbSeverity[] = [
    "low",
    "medium",
    "high",
    "critical",
    "low",
    "medium",
    "high",
    "low",
    "medium",
    "high",
    "low",
    "critical",
  ];
  let h = 0;
  for (let i = 0; i < job.id.length; i++) h += job.id.charCodeAt(i);
  return Array.from({ length: 12 }, (_, i) => ({
    seed: `${job.id}-img-${i}`,
    severity: cycle[(i + h) % cycle.length],
    confidence: 68 + ((h + i * 7) % 27),
  }));
}

type SeverityFilter = "all" | ThumbSeverity;

function severityLabel(s: ThumbSeverity): string {
  switch (s) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    case "critical":
      return "Critical";
  }
}

function severityShort(s: ThumbSeverity): string {
  switch (s) {
    case "low":
      return "L";
    case "medium":
      return "M";
    case "high":
      return "H";
    case "critical":
      return "C";
  }
}

function severityPillClass(s: ThumbSeverity): string {
  switch (s) {
    case "low":
      return "severity-low";
    case "medium":
      return "severity-medium";
    case "high":
      return "severity-high";
    case "critical":
      return "severity-critical";
  }
}

function buildActivityEntries(job: MockPortfolioJob) {
  const t0 = new Date(job.created_at).getTime();
  const step = 4 * 60 * 1000;
  return [
    { t: t0, label: "Job created", Icon: Sparkles },
    { t: t0 + step, label: "Upload completed", Icon: FileUp },
    { t: t0 + step * 2, label: "Detection started", Icon: Cpu },
    { t: t0 + step * 3, label: "First batch done", Icon: CheckCircle2 },
    { t: t0 + step * 4, label: "Manual review flagged", Icon: Flag },
    { t: t0 + step * 5, label: "QC pass on calibration strip", Icon: CheckCircle2 },
    { t: t0 + step * 6, label: "Detection completed", Icon: CheckCircle2 },
    { t: t0 + step * 7, label: "Report staged for download", Icon: Layers },
  ];
}

function SiteMapPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-muted/30 p-4 ring-1 ring-border">
      <p className="mb-3 text-sm font-medium text-foreground">Site map</p>
      <svg
        viewBox="0 0 200 120"
        className="h-32 w-full text-primary/20"
        aria-hidden
      >
        <defs>
          <linearGradient id="hm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" rx="8" fill="url(#hm)" />
        {Array.from({ length: 8 * 12 }).map((_, i) => {
          const row = Math.floor(i / 12);
          const col = i % 12;
          const v = ((row + col) % 4) / 4;
          return (
            <rect
              key={`${row}-${col}`}
              x={4 + col * 16}
              y={4 + row * 14}
              width="14"
              height="12"
              rx="2"
              fill="currentColor"
              opacity={0.15 + v * 0.35}
            />
          );
        })}
        <path
          d="M 20 95 Q 100 40 180 85"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeOpacity="0.5"
          strokeLinecap="round"
        />
      </svg>
      <p className="mt-2 text-xs text-muted-foreground">
        Illustrative heatmap — not georeferenced.
      </p>
    </div>
  );
}

function JobNotFoundPanel() {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-xl bg-card p-6 ring-1 ring-border animate-fade-up">
      <h2 className="text-lg font-semibold tracking-tight">Job not found</h2>
      <p className="text-sm text-muted-foreground">
        No mock job matches that ID. Check the URL or return to the portfolio
        listing.
      </p>
      <Link
        href="/jobs-portfolio"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "inline-flex items-center gap-1.5"
        )}
      >
        <ArrowLeft className="size-3.5" />
        Jobs Portfolio
      </Link>
    </div>
  );
}

function JobDetailView({ job }: { job: MockPortfolioJob }) {
  const [tab, setTab] = useState<DetailTabId>("overview");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");

  const sc = statusConfig[job.status];
  const detections = totalDetections(job);
  const thumbs = useMemo(() => buildImageThumbs(job), [job]);
  const activity = useMemo(() => buildActivityEntries(job), [job]);

  const severityRows = useMemo(() => {
    const { low, medium, high, critical } = job.severityCounts;
    const total = Math.max(1, low + medium + high + critical);
    const trends: Record<ThumbSeverity, string> = {
      low: "Stable",
      medium: "Up vs last",
      high: "Flat",
      critical: "Down vs last",
    };
    return (
      [
        { key: "low" as const, count: low, trend: trends.low },
        { key: "medium" as const, count: medium, trend: trends.medium },
        { key: "high" as const, count: high, trend: trends.high },
        { key: "critical" as const, count: critical, trend: trends.critical },
      ] as const
    ).map((row) => ({
      ...row,
      pct: total > 0 ? Math.round((row.count / total) * 1000) / 10 : 0,
    }));
  }, [job.severityCounts]);

  const filteredSeverityRows =
    severityFilter === "all"
      ? severityRows
      : severityRows.filter((r) => r.key === severityFilter);

  const pctLow =
    detections > 0 ? (job.severityCounts.low / detections) * 100 : 0;
  const pctMed =
    detections > 0 ? (job.severityCounts.medium / detections) * 100 : 0;
  const pctHigh =
    detections > 0 ? (job.severityCounts.high / detections) * 100 : 0;
  const pctCrit =
    detections > 0 ? (job.severityCounts.critical / detections) * 100 : 0;

  const tabs: { id: DetailTabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "images", label: "Images" },
    { id: "severity", label: "Severity" },
    { id: "activity", label: "Activity" },
  ];

  const chipOptions: { id: SeverityFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "low", label: "Low" },
    { id: "medium", label: "Medium" },
    { id: "high", label: "High" },
    { id: "critical", label: "Critical" },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/jobs-portfolio"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Jobs Portfolio
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => {}}>
            Re-run analysis
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => {}}>
            Download report
          </Button>
        </div>
      </div>

      <div className="space-y-3 rounded-xl bg-card p-5 ring-1 ring-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <span className="font-mono text-xs text-muted-foreground">
              {job.id}
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {job.siteName}
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {job.descriptionLine}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium",
                sc.class
              )}
            >
              {job.status === "processing" && (
                <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-current" />
              )}
              {sc.label}
            </span>
            <span className="text-xs text-muted-foreground">
              Created{" "}
              {formatDistanceToNow(new Date(job.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortfolioKpiTile
          label="Images scanned"
          value={job.total_images.toLocaleString()}
          icon={Layers}
          accent="bg-primary/15 text-primary"
          delay={0}
        />
        <PortfolioKpiTile
          label="Detections"
          value={detections.toLocaleString()}
          icon={Sparkles}
          accent="bg-cyan-accent/15 text-cyan-accent"
          delay={60}
        />
        <PortfolioKpiTile
          label="Avg confidence"
          value={
            job.avgConfidencePct > 0 ? `${job.avgConfidencePct}%` : "—"
          }
          icon={MapPin}
          accent="bg-severity-low/15 text-severity-low"
          delay={120}
        />
        <PortfolioKpiTile
          label="Duration"
          value={job.durationLabel}
          icon={Timer}
          accent="bg-severity-medium/15 text-severity-medium"
          delay={180}
        />
      </div>

      <div className="rounded-xl bg-card ring-1 ring-border">
        <div
          role="tablist"
          className="flex flex-wrap gap-1 border-b border-border p-2"
        >
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tab === id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                {(
                  [
                    ["Operator", job.operator],
                    ["Camera rig", job.cameraRig],
                    ["Weather", job.weather],
                    ["Notes", job.notes],
                  ] as const
                ).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-4 border-b border-border py-2 text-sm last:border-0"
                  >
                    <span className="text-muted-foreground">{k}</span>
                    <span className="text-right font-medium text-foreground">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <SiteMapPlaceholder />
            </div>
          )}

          {tab === "images" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {thumbs.map((thumb) => (
                <div
                  key={thumb.seed}
                  className="group relative aspect-[3/2] overflow-hidden rounded-xl ring-1 ring-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(thumb.seed)}/300/200`}
                    alt=""
                    className="size-full object-cover transition-opacity duration-200 group-hover:opacity-70"
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                        severityPillClass(thumb.severity)
                      )}
                    >
                      {severityShort(thumb.severity)} · {thumb.confidence}%
                    </span>
                  </div>
                  <div className="pointer-events-none absolute left-2 top-2 opacity-100 transition-opacity duration-200 group-hover:opacity-0">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-sm",
                        severityPillClass(thumb.severity)
                      )}
                    >
                      {severityShort(thumb.severity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "severity" && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {chipOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSeverityFilter(c.id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      severityFilter === c.id
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {detections > 0 ? (
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                  {pctLow > 0 && (
                    <div
                      className="h-full bg-severity-low"
                      style={{ width: `${pctLow}%` }}
                    />
                  )}
                  {pctMed > 0 && (
                    <div
                      className="h-full bg-severity-medium"
                      style={{ width: `${pctMed}%` }}
                    />
                  )}
                  {pctHigh > 0 && (
                    <div
                      className="h-full bg-severity-high"
                      style={{ width: `${pctHigh}%` }}
                    />
                  )}
                  {pctCrit > 0 && (
                    <div
                      className="h-full bg-severity-critical"
                      style={{ width: `${pctCrit}%` }}
                    />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No detections for this job yet.
                </p>
              )}

              <div className="overflow-hidden rounded-xl ring-1 ring-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Severity
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Count
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        %
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredSeverityRows.map((row) => (
                      <tr key={row.key} className="hover:bg-muted/20">
                        <td className="px-4 py-2.5">
                          <span
                            className={cn(
                              "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                              severityPillClass(row.key)
                            )}
                          >
                            {severityLabel(row.key)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs">
                          {row.count}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs">
                          {row.pct}%
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {row.trend}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "activity" && (
            <ul className="relative space-y-0 pl-2">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
              {activity.map(({ t, label, Icon }) => (
                <li
                  key={`${t}-${label}`}
                  className="relative flex gap-4 pb-8 pl-8 last:pb-0"
                >
                  <div className="absolute left-0 flex size-8 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobPortfolioDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const job = getMockPortfolioJobById(jobId);

  if (!job) {
    return <JobNotFoundPanel />;
  }

  return <JobDetailView job={job} />;
}
