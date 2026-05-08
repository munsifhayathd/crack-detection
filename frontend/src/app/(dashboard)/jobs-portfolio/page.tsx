"use client";

import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays, MapPin, Timer } from "lucide-react";
import { MOCK_PORTFOLIO_JOBS } from "@/data/mock-portfolio-jobs";
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
    <Link
      href={`/jobs-portfolio/${job.id}`}
      className={cn(
        "group flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-border transition-all",
        "cursor-pointer hover:bg-muted/20 hover:shadow-md hover:shadow-black/10",
        "hover:ring-2 hover:ring-primary/30"
      )}
    >
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
    </Link>
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
        {MOCK_PORTFOLIO_JOBS.map((job) => (
          <JobPortfolioCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
