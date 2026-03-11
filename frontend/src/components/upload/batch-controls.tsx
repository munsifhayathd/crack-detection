"use client";

import {
  Play,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  Loader2,
  XCircle,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BatchState } from "@/store/upload-store";

interface BatchControlsProps {
  batch: BatchState;
  selectedCount: number;
  onProcessBatch: () => void;
  onNextBatch: () => void;
  onBatchSizeChange: (size: number) => void;
  onReset: () => void;
}

const BATCH_SIZE_OPTIONS = [5, 10, 25, 50];

export function BatchControls({
  batch,
  selectedCount,
  onProcessBatch,
  onNextBatch,
  onBatchSizeChange,
  onReset,
}: BatchControlsProps) {
  const totalBatches = Math.ceil(selectedCount / batch.batchSize);
  const isProcessing = batch.currentBatchStatus === "processing";
  const isCompleted = batch.currentBatchStatus === "completed";
  const isFailed = batch.currentBatchStatus === "failed";
  const allDone = batch.processedBatches >= totalBatches && totalBatches > 0;

  // Current batch items range
  const batchStart = batch.batchIndex * batch.batchSize + 1;
  const batchEnd = Math.min(
    (batch.batchIndex + 1) * batch.batchSize,
    selectedCount
  );

  return (
    <div className="rounded-xl bg-card ring-1 ring-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Batch Processing</h3>
        </div>
        {batch.processedBatches > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs">
            <RotateCcw className="size-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-4 p-5">
        {/* Batch size selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Batch Size
          </label>
          <div className="flex gap-1.5">
            {BATCH_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => onBatchSizeChange(size)}
                disabled={isProcessing}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-xs font-mono font-medium transition-all",
                  batch.batchSize === size
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                  isProcessing && "opacity-50 cursor-not-allowed"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Batch info */}
        <div className="rounded-lg bg-muted/20 px-4 py-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Selected rows</span>
            <span className="font-mono font-medium">{selectedCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total batches</span>
            <span className="font-mono font-medium">{totalBatches}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Current batch</span>
            <span className="font-mono font-medium">
              {allDone ? "Done" : `${batch.batchIndex + 1} of ${totalBatches}`}
            </span>
          </div>
          {!allDone && selectedCount > 0 && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
              <span className="text-muted-foreground">Processing rows</span>
              <span className="font-mono font-medium">
                {batchStart}–{batchEnd}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar for current batch */}
        {isProcessing && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Processing batch {batch.batchIndex + 1}...
              </span>
              <span className="font-mono tabular-nums">
                {batch.currentBatchProgress}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${batch.currentBatchProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Completed batch status */}
        {isCompleted && !allDone && (
          <div className="flex items-center gap-2 rounded-lg bg-severity-low/10 px-3 py-2 text-xs">
            <CheckCircle2 className="size-3.5 text-severity-low" />
            <span>
              Batch {batch.batchIndex + 1} complete &middot;{" "}
              <span className="font-mono">{batch.batchSize - (batch.failedRows - (batch.processedBatches > 1 ? batch.failedRows : 0))}</span> processed
            </span>
          </div>
        )}

        {/* Failed batch status */}
        {isFailed && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs">
            <XCircle className="size-3.5 text-destructive" />
            <span>Batch {batch.batchIndex + 1} failed</span>
          </div>
        )}

        {/* Overall progress */}
        {batch.processedBatches > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-muted/30 p-2.5 text-center">
              <p className="font-mono text-sm font-semibold tabular-nums">
                {batch.processedBatches}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Batches
              </p>
            </div>
            <div className="rounded-lg bg-severity-low/5 p-2.5 text-center">
              <p className="font-mono text-sm font-semibold tabular-nums text-severity-low">
                {batch.processedRows}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Processed
              </p>
            </div>
            <div className="rounded-lg bg-destructive/5 p-2.5 text-center">
              <p className="font-mono text-sm font-semibold tabular-nums text-destructive">
                {batch.failedRows}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Failed
              </p>
            </div>
          </div>
        )}

        {/* All done */}
        {allDone && (
          <div className="rounded-lg bg-severity-low/10 border border-severity-low/20 p-4 text-center space-y-1">
            <CheckCircle2 className="size-5 text-severity-low mx-auto" />
            <p className="text-sm font-medium">All batches processed</p>
            <p className="text-xs text-muted-foreground">
              {batch.processedRows} rows processed &middot; {batch.failedRows} failed
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!allDone && (
          <div className="flex gap-2">
            {batch.currentBatchStatus === "idle" && (
              <Button
                onClick={onProcessBatch}
                disabled={selectedCount === 0}
                className="flex-1 gap-2"
              >
                <Play className="size-4" />
                Process Batch {batch.batchIndex + 1}
              </Button>
            )}
            {(isCompleted || isFailed) && (
              <Button
                onClick={onNextBatch}
                className="flex-1 gap-2"
                variant={isFailed ? "outline" : "default"}
              >
                <SkipForward className="size-4" />
                {isFailed ? "Retry" : "Next Batch"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
