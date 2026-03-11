"use client";

import { create } from "zustand";
import type { CrackResult, DashboardStats } from "@/types";

interface ResultsState {
  results: CrackResult[];
  stats: DashboardStats | null;
  isLoading: boolean;
  setResults: (results: CrackResult[]) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
}

export const useResultsStore = create<ResultsState>((set) => ({
  results: [],
  stats: null,
  isLoading: false,
  setResults: (results) => set({ results }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
}));
