"use client";

import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProcessingJob } from "@/types";

const statusIcons = {
  pending: Clock,
  processing: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
};

interface ProcessingProgressProps {
  job: ProcessingJob;
}

export function ProcessingProgress({ job }: ProcessingProgressProps) {
  const progress =
    job.total_images > 0
      ? Math.round((job.processed_count / job.total_images) * 100)
      : 0;
  const StatusIcon = statusIcons[job.status];

  return (
    <div className="rounded-xl bg-card ring-1 ring-border">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Processing Status</h3>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
              `status-${job.status}`
            )}
          >
            <StatusIcon
              className={cn(
                "size-3",
                job.status === "processing" && "animate-spin"
              )}
            />
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* Main progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono tabular-nums">
              {job.processed_count}/{job.total_images}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                job.status === "failed"
                  ? "bg-destructive"
                  : job.status === "completed"
                  ? "bg-severity-low"
                  : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="font-mono text-lg font-semibold tabular-nums">
              {job.total_images}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total
            </p>
          </div>
          <div className="rounded-lg bg-severity-low/5 p-3 text-center">
            <p className="font-mono text-lg font-semibold tabular-nums text-severity-low">
              {job.processed_count}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Processed
            </p>
          </div>
          <div className="rounded-lg bg-destructive/5 p-3 text-center">
            <p className="font-mono text-lg font-semibold tabular-nums text-destructive">
              {job.failed_count}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Failed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
