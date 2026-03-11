"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import type { CsvRow } from "@/types";

interface CsvParserState {
  rows: CsvRow[];
  headers: string[];
  fileName: string | null;
  error: string | null;
  isParsing: boolean;
}

export function useCsvParser() {
  const [state, setState] = useState<CsvParserState>({
    rows: [],
    headers: [],
    fileName: null,
    error: null,
    isParsing: false,
  });

  const parseFile = useCallback((file: File) => {
    setState((s) => ({ ...s, isParsing: true, error: null, fileName: file.name }));

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          setState((s) => ({
            ...s,
            isParsing: false,
            error: `Parse error: ${result.errors[0].message}`,
          }));
          return;
        }
        setState({
          rows: result.data,
          headers: result.meta.fields || [],
          fileName: file.name,
          error: null,
          isParsing: false,
        });
      },
      error: (err) => {
        setState((s) => ({
          ...s,
          isParsing: false,
          error: err.message,
        }));
      },
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      rows: [],
      headers: [],
      fileName: null,
      error: null,
      isParsing: false,
    });
  }, []);

  return { ...state, parseFile, reset };
}
