"use client";

import type { ElementType, ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays, MapPin, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioJob, ProcessingJob } from "@/types";

const statusConfig: Record<
  ProcessingJob["status"],
  { label: string; class: string }
> = {
  pending: { label: "Pending", class: "status-pending" },
  processing: { label: "Processing", class: "status-processing" },
  completed: { label: "Completed", class: "status-completed" },
  failed: { label: "Failed", class: "status-failed" },
};

const portfolioJobs: PortfolioJob[] = [
  {
    id: "job-014",
    siteName: "Sydney Harbour Bridge — Span 4",
    status: "completed",
    total_images: 890,
    processed_count: 890,
    failed_count: 12,
    created_at: "2026-05-05T08:15:00Z",
    severityCounts: { low: 12, medium: 8, high: 3, critical: 1 },
  },
  {
    id: "job-015",
    siteName: "M1 Pacific Mwy KM 142",
    status: "processing",
    total_images: 640,
    processed_count: 412,
    failed_count: 4,
    created_at: "2026-05-07T14:20:00Z",
    severityCounts: { low: 34, medium: 21, high: 9, critical: 2 },
  },
  {
    id: "job-016",
    siteName: "Melbourne Tullamarine Apron 7",
    status: "pending",
    total_images: 210,
    processed_count: 0,
    failed_count: 0,
    created_at: "2026-05-08T06:00:00Z",
    severityCounts: { low: 0, medium: 0, high: 0, critical: 0 },
  },
  {
    id: "job-017",
    siteName: "Brisbane Gateway Motorway North",
    status: "completed",
    total_images: 1240,
    processed_count: 1240,
    failed_count: 5,
    created_at: "2026-05-02T11:45:00Z",
    severityCounts: { low: 88, medium: 42, high: 15, critical: 4 },
  },
  {
    id: "job-018",
    siteName: "Great Ocean Road — Cape Otway TK 52",
    status: "failed",
    total_images: 180,
    processed_count: 96,
    failed_count: 84,
    created_at: "2026-05-01T09:30:00Z",
    severityCounts: { low: 5, medium: 12, high: 8, critical: 6 },
  },
  {
    id: "job-019",
    siteName: "Perth Mitchell Fwy — Narrows interchange",
    status: "processing",
    total_images: 520,
    processed_count: 318,
    failed_count: 2,
    created_at: "2026-05-06T16:10:00Z",
    severityCounts: { low: 22, medium: 18, high: 7, critical: 1 },
  },
  {
    id: "job-020",
    siteName: "Adelaide Southern Expressway Stage 3",
    status: "completed",
    total_images: 760,
    processed_count: 760,
    failed_count: 0,
    created_at: "2026-04-28T13:00:00Z",
    severityCounts: { low: 56, medium: 31, high: 11, critical: 2 },
  },
  {
    id: "job-021",
    siteName: "Hobart Tasman Hwy — Bridgewater causeway",
    status: "pending",
    total_images: 340,
    processed_count: 0,
    failed_count: 0,
    created_at: "2026-05-08T02:25:00Z",
    severityCounts: { low: 0, medium: 0, high: 0, critical: 0 },
  },
  {
    id: "job-022",
    siteName: "Canberra Monaro Hwy — Hume merge",
    status: "completed",
    total_images: 415,
    processed_count: 415,
    failed_count: 7,
    created_at: "2026-04-30T07:40:00Z",
    severityCounts: { low: 28, medium: 14, high: 9, critical: 0 },
  },
  {
    id: "job-023",
    siteName: "Darwin Tiger Brennan Dr — Bayview bend",
    status: "completed",
    total_images: 275,
    processed_count: 275,
    failed_count: 1,
    created_at: "2026-05-04T19:55:00Z",
    severityCounts: { low: 19, medium: 10, high: 4, critical: 1 },
  },
];

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

function JobPortfolioCard({ job }: { job: PortfolioJob }) {
  const sc = statusConfig[job.status];
  const progress =
    job.total_images > 0
      ? Math.round((job.processed_count / job.total_images) * 100)
      : 0;

  const { low, medium, high, critical } = job.severityCounts;

  return (
    <div className="group flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-border transition-all hover:ring-2 hover:ring-primary/30">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs text-foreground">{job.id}</span>
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
      </div>
      <p className="text-sm font-medium leading-snug text-foreground/90">
        {job.siteName}
      </p>
      <div className="flex items-center gap-2.5">
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              job.status === "failed"
                ? "bg-destructive"
                : job.status === "completed"
                  ? "bg-severity-low"
                  : "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {progress}%
        </span>
      </div>
      <div className="font-mono text-xs">
        <span>
          {job.processed_count} / {job.total_images}
        </span>
        {job.failed_count > 0 && (
          <span className="ml-1.5 text-destructive">
            ({job.failed_count} err)
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
      </p>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px]">
        <span className="inline-flex items-center rounded-md px-1.5 py-0.5 font-medium severity-low">
          L {low}
        </span>
        <span className="text-muted-foreground/60">·</span>
        <span className="inline-flex items-center rounded-md px-1.5 py-0.5 font-medium severity-medium">
          M {medium}
        </span>
        <span className="text-muted-foreground/60">·</span>
        <span className="inline-flex items-center rounded-md px-1.5 py-0.5 font-medium severity-high">
          H {high}
        </span>
        <span className="text-muted-foreground/60">·</span>
        <span className="inline-flex items-center rounded-md px-1.5 py-0.5 font-medium severity-critical">
          C {critical}
        </span>
      </div>
    </div>
  );
}

export default function JobsPortfolioPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
        <PortfolioKpiTile
          label="Active Sites"
          value={12}
          icon={MapPin}
          accent="bg-primary/15 text-primary"
          delay={0}
        />
        <PortfolioKpiTile
          label="Jobs This Month"
          value={47}
          icon={CalendarDays}
          accent="bg-cyan-accent/15 text-cyan-accent"
          delay={60}
        />
        <PortfolioKpiTile
          label="Avg Turnaround"
          value="4.6h"
          icon={Timer}
          accent="bg-severity-low/15 text-severity-low"
          delay={120}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolioJobs.map((job) => (
          <JobPortfolioCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
