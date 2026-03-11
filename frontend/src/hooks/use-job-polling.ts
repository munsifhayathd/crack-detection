"use client";

import { useEffect, useRef, useCallback } from "react";
import { api } from "@/lib/api/client";
import { useJobsStore } from "@/store/jobs-store";
import type { ProcessingJob, ApiResponse } from "@/types";

const POLL_INTERVAL = 3000;

export function useJobPolling(jobId: string | null) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const updateJob = useJobsStore((s) => s.updateJob);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!jobId) {
      stopPolling();
      return;
    }

    const poll = async () => {
      try {
        const res = await api.get<ApiResponse<ProcessingJob>>(`/jobs/${jobId}`);
        const job = res.data;
        updateJob(jobId, job);

        if (job.status === "completed" || job.status === "failed") {
          stopPolling();
        }
      } catch {
        // silently continue polling on transient errors
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return stopPolling;
  }, [jobId, updateJob, stopPolling]);

  return { stopPolling };
}
