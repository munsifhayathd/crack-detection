"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES = [".csv", ".xlsx", ".json"];

interface CsvUploadZoneProps {
  onFileSelect: (file: File) => void;
  fileName: string | null;
  onClear: () => void;
}

export function CsvUploadZone({
  onFileSelect,
  fileName,
  onClear,
}: CsvUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (fileName) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
        <div className="flex size-10 items-center justify-center rounded-lg bg-severity-low/15">
          <FileSpreadsheet className="size-5 text-severity-low" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted-foreground">File ready for preview</p>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClear}>
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "group relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
          : "border-border hover:border-primary/40 hover:bg-muted/30"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-xl transition-all",
            isDragging
              ? "bg-primary/15 text-primary scale-110"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          <Upload className="size-6" />
        </div>
        <div>
          <p className="text-sm font-medium">
            Drop your file here or{" "}
            <span className="text-primary">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports CSV, XLSX, JSON
          </p>
        </div>
      </div>

      {/* Grid overlay effect on drag */}
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 rounded-xl grid-overlay opacity-50" />
      )}
    </div>
  );
}
