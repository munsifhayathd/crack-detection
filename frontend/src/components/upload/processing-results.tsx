"use client";

import Link from "next/link";
import { CheckCircle2, Map, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProcessingJob } from "@/types";

interface ProcessingResultsProps {
  job: ProcessingJob;
}

export function ProcessingResults({ job }: ProcessingResultsProps) {
  const successRate =
    job.total_images > 0
      ? Math.round(
          ((job.processed_count - job.failed_count) / job.total_images) * 100
        )
      : 0;

  return (
    <div className="rounded-xl bg-card ring-1 ring-border">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-severity-low" />
          <h3 className="text-sm font-semibold">Processing Complete</h3>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p className="mt-1 font-mono text-xl font-bold tabular-nums">
              {successRate}%
            </p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Total Analyzed</p>
            <p className="mt-1 font-mono text-xl font-bold tabular-nums">
              {job.processed_count}
            </p>
          </div>
        </div>

        <Link href={`/map?job_id=${job.id}`}>
          <Button className="w-full gap-2" variant="default">
            <Map className="size-4" />
            View Results on Map
            <ArrowRight className="size-3.5 ml-auto" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
