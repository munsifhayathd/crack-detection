"use client";

import { create } from "zustand";
import type { CsvRow } from "@/types";

export interface BatchState {
  batchIndex: number;
  batchSize: number;
  totalBatches: number;
  processedBatches: number;
  currentBatchStatus: "idle" | "processing" | "completed" | "failed";
  currentBatchProgress: number; // 0-100
  processedRows: number;
  failedRows: number;
}

interface UploadState {
  // CSV data
  rows: CsvRow[];
  headers: string[];
  fileName: string | null;

  // Selection
  selectedIndices: Set<number>;

  // Batch processing
  batch: BatchState;

  // Actions
  setData: (rows: CsvRow[], headers: string[], fileName: string) => void;
  toggleRow: (index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  selectRange: (start: number, end: number) => void;
  setBatchSize: (size: number) => void;
  startBatch: () => void;
  updateBatchProgress: (progress: number) => void;
  completeBatch: (failed: number) => void;
  failBatch: () => void;
  nextBatch: () => void;
  resetUpload: () => void;
}

const initialBatch: BatchState = {
  batchIndex: 0,
  batchSize: 5,
  totalBatches: 0,
  processedBatches: 0,
  currentBatchStatus: "idle",
  currentBatchProgress: 0,
  processedRows: 0,
  failedRows: 0,
};

export const useUploadStore = create<UploadState>((set, get) => ({
  rows: [],
  headers: [],
  fileName: null,
  selectedIndices: new Set(),
  batch: initialBatch,

  setData: (rows, headers, fileName) => {
    const batchSize = get().batch.batchSize;
    set({
      rows,
      headers,
      fileName,
      selectedIndices: new Set(rows.map((_, i) => i)),
      batch: {
        ...initialBatch,
        batchSize,
        totalBatches: Math.ceil(rows.length / batchSize),
      },
    });
  },

  toggleRow: (index) =>
    set((s) => {
      const next = new Set(s.selectedIndices);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return { selectedIndices: next };
    }),

  selectAll: () =>
    set((s) => ({
      selectedIndices: new Set(s.rows.map((_, i) => i)),
    })),

  deselectAll: () => set({ selectedIndices: new Set() }),

  selectRange: (start, end) =>
    set(() => {
      const next = new Set<number>();
      for (let i = start; i <= end; i++) next.add(i);
      return { selectedIndices: next };
    }),

  setBatchSize: (size) =>
    set((s) => ({
      batch: {
        ...s.batch,
        batchSize: size,
        totalBatches: Math.ceil(
          (s.selectedIndices.size || s.rows.length) / size
        ),
      },
    })),

  startBatch: () =>
    set((s) => ({
      batch: {
        ...s.batch,
        currentBatchStatus: "processing",
        currentBatchProgress: 0,
      },
    })),

  updateBatchProgress: (progress) =>
    set((s) => ({
      batch: { ...s.batch, currentBatchProgress: progress },
    })),

  completeBatch: (failed) =>
    set((s) => ({
      batch: {
        ...s.batch,
        currentBatchStatus: "completed",
        currentBatchProgress: 100,
        processedBatches: s.batch.processedBatches + 1,
        processedRows: s.batch.processedRows + s.batch.batchSize,
        failedRows: s.batch.failedRows + failed,
      },
    })),

  failBatch: () =>
    set((s) => ({
      batch: { ...s.batch, currentBatchStatus: "failed" },
    })),

  nextBatch: () =>
    set((s) => ({
      batch: {
        ...s.batch,
        batchIndex: s.batch.batchIndex + 1,
        currentBatchStatus: "idle",
        currentBatchProgress: 0,
      },
    })),

  resetUpload: () =>
    set({
      rows: [],
      headers: [],
      fileName: null,
      selectedIndices: new Set(),
      batch: initialBatch,
    }),
}));
