"use client";

import { create } from "zustand";
import type { ProcessingJob } from "@/types";

interface JobsState {
  jobs: ProcessingJob[];
  activeJobId: string | null;
  isLoading: boolean;
  setJobs: (jobs: ProcessingJob[]) => void;
  addJob: (job: ProcessingJob) => void;
  updateJob: (id: string, updates: Partial<ProcessingJob>) => void;
  setActiveJobId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs: [],
  activeJobId: null,
  isLoading: false,
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
  updateJob: (id, updates) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),
  setActiveJobId: (activeJobId) => set({ activeJobId }),
  setLoading: (isLoading) => set({ isLoading }),
}));
