"use client";

import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
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

interface RecentJobsTableProps {
  jobs: ProcessingJob[];
}

export function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <div className="border-b border-border px-5 py-3.5">
        <h3 className="text-sm font-semibold">Recent Jobs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Job ID
              </th>
              <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Progress
              </th>
              <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Images
              </th>
              <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Created
              </th>
              <th className="px-5 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => {
              const sc = statusConfig[job.status];
              const progress =
                job.total_images > 0
                  ? Math.round(
                      (job.processed_count / job.total_images) * 100
                    )
                  : 0;

              return (
                <tr
                  key={job.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs">{job.id}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                        sc.class
                      )}
                    >
                      {job.status === "processing" && (
                        <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-current" />
                      )}
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
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
                      <span className="font-mono text-xs text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs">
                      {job.processed_count}/{job.total_images}
                    </span>
                    {job.failed_count > 0 && (
                      <span className="ml-1.5 text-xs text-destructive">
                        ({job.failed_count} err)
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(job.created_at), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/map?job_id=${job.id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="size-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
