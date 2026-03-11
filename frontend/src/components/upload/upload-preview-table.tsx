"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { CsvRow } from "@/types";

interface UploadPreviewTableProps {
  headers: string[];
  rows: CsvRow[];
  selectedIndices: Set<number>;
  onToggleRow: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  batchStart?: number;
  batchEnd?: number;
  maxRows?: number;
}

export function UploadPreviewTable({
  headers,
  rows,
  selectedIndices,
  onToggleRow,
  onSelectAll,
  onDeselectAll,
  batchStart,
  batchEnd,
  maxRows = 50,
}: UploadPreviewTableProps) {
  const displayRows = rows.slice(0, maxRows);
  const remaining = rows.length - maxRows;
  const allSelected = selectedIndices.size === rows.length;

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h3 className="text-sm font-semibold">Data Preview</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="text-xs text-primary hover:underline"
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
          <span className="font-mono text-xs text-muted-foreground">
            {selectedIndices.size}/{rows.length} selected
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2.5 text-center w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() =>
                    allSelected ? onDeselectAll() : onSelectAll()
                  }
                />
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-12">
                #
              </th>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayRows.map((row, i) => {
              const isSelected = selectedIndices.has(i);
              const isInBatch =
                batchStart !== undefined &&
                batchEnd !== undefined &&
                i >= batchStart &&
                i < batchEnd;

              return (
                <tr
                  key={i}
                  className={cn(
                    "transition-colors",
                    isInBatch
                      ? "bg-primary/5"
                      : isSelected
                      ? "hover:bg-muted/20"
                      : "opacity-40 hover:bg-muted/10"
                  )}
                >
                  <td className="px-3 py-2 text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleRow(i)}
                    />
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </td>
                  {headers.map((h) => (
                    <td
                      key={h}
                      className="max-w-40 truncate px-3 py-2 font-mono text-xs"
                    >
                      {row[h] || "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {remaining > 0 && (
        <div className="border-t border-border bg-muted/20 px-5 py-2.5 text-center">
          <span className="text-xs text-muted-foreground">
            + {remaining.toLocaleString()} more rows (scroll in data panel)
          </span>
        </div>
      )}
    </div>
  );
}
