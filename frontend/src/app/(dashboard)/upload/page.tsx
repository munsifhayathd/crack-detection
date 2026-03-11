"use client";

import { useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CsvUploadZone } from "@/components/upload/csv-upload-zone";
import { UploadPreviewTable } from "@/components/upload/upload-preview-table";
import { BatchControls } from "@/components/upload/batch-controls";
import { DataSidebar } from "@/components/upload/data-sidebar";
import { ProcessingResults } from "@/components/upload/processing-results";
import { useUploadStore } from "@/store/upload-store";
import type { ProcessingJob } from "@/types";

export default function UploadPage() {
  const store = useUploadStore();

  const hasData = store.rows.length > 0;
  const totalBatches = Math.ceil(store.selectedIndices.size / store.batch.batchSize);
  const allDone = store.batch.processedBatches >= totalBatches && totalBatches > 0;

  // Current batch row range (from selected indices)
  const selectedArray = Array.from(store.selectedIndices).sort((a, b) => a - b);
  const batchStart = store.batch.batchIndex * store.batch.batchSize;
  const batchEnd = Math.min(batchStart + store.batch.batchSize, selectedArray.length);
  const currentBatchIndices = selectedArray.slice(batchStart, batchEnd);

  // Parse file and push data to store
  const handleFileParsed = useCallback(
    (file: File) => {
      import("papaparse").then((Papa) => {
        Papa.default.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            if (result.data.length > 0) {
              store.setData(
                result.data as Record<string, string>[],
                result.meta.fields || [],
                file.name
              );
            }
          },
        });
      });
    },
    [store]
  );

  const handleProcessBatch = useCallback(() => {
    store.startBatch();

    const batchSize = currentBatchIndices.length;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.ceil(100 / 6); // ~6 ticks to complete
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        const failed = Math.random() < 0.15 ? 1 : 0; // occasional failure
        store.completeBatch(failed);
      } else {
        store.updateBatchProgress(Math.min(progress, 99));
      }
    }, 600);
  }, [store, currentBatchIndices.length]);

  const handleNextBatch = useCallback(() => {
    store.nextBatch();
  }, [store]);

  const handleReset = useCallback(() => {
    store.resetUpload();
  }, [store]);

  // Create a mock completed job for the results view
  const completedJob: ProcessingJob | null = allDone
    ? {
        id: `batch-${Date.now().toString(36)}`,
        status: "completed",
        total_images: store.batch.processedRows,
        processed_count: store.batch.processedRows - store.batch.failedRows,
        failed_count: store.batch.failedRows,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      }
    : null;

  // Upload view (no data yet)
  if (!hasData) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
        <div>
          <h2 className="text-lg font-semibold">Upload Data</h2>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with image references and GPS coordinates
          </p>
        </div>
        <CsvUploadZone
          onFileSelect={handleFileParsed}
          fileName={null}
          onClear={() => {}}
        />
      </div>
    );
  }

  // Main data view with sidebar
  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Process Data</h2>
          <p className="text-sm text-muted-foreground">
            Select rows and process in batches
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="size-3.5 mr-1.5" />
          Start Over
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar - data overview */}
        <div className="w-72 shrink-0">
          <div className="sticky top-20 space-y-4">
            <DataSidebar
              fileName={store.fileName!}
              headers={store.headers}
              rows={store.rows}
              selectedCount={store.selectedIndices.size}
            />
            <BatchControls
              batch={store.batch}
              selectedCount={store.selectedIndices.size}
              onProcessBatch={handleProcessBatch}
              onNextBatch={handleNextBatch}
              onBatchSizeChange={store.setBatchSize}
              onReset={() => {
                store.resetUpload();
                // Re-set data to keep the file loaded
              }}
            />
            {completedJob && <ProcessingResults job={completedJob} />}
          </div>
        </div>

        {/* Main content - data table */}
        <div className="min-w-0 flex-1">
          <UploadPreviewTable
            headers={store.headers}
            rows={store.rows}
            selectedIndices={store.selectedIndices}
            onToggleRow={store.toggleRow}
            onSelectAll={store.selectAll}
            onDeselectAll={store.deselectAll}
            batchStart={
              currentBatchIndices.length > 0 ? currentBatchIndices[0] : undefined
            }
            batchEnd={
              currentBatchIndices.length > 0
                ? currentBatchIndices[currentBatchIndices.length - 1] + 1
                : undefined
            }
            maxRows={100}
          />
        </div>
      </div>
    </div>
  );
}
