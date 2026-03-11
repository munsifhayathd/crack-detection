"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { isNetworkError, isTimeoutError, isApiError } from "./errors";

interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
  options: { enabled?: boolean } = {}
) {
  const { enabled = true } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null, error: null, isLoading: enabled, isError: false, isSuccess: false,
  });
  const abortRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetcher(controller.signal);
      setState({ data, error: null, isLoading: false, isError: false, isSuccess: true });
      return data;
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      setState({ data: null, error: error as Error, isLoading: false, isError: true, isSuccess: false });
      throw error;
    }
  }, [fetcher]);

  useEffect(() => {
    if (enabled) execute();
    return () => { abortRef.current?.abort(); };
  }, [...deps, enabled]);

  return {
    ...state,
    refetch: execute,
    isNetworkError: isNetworkError(state.error),
    isTimeoutError: isTimeoutError(state.error),
    isApiError: isApiError(state.error),
  };
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null, error: null, isLoading: false, isError: false, isSuccess: false,
  });

  const mutate = useCallback(async (variables: TVariables) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await mutationFn(variables);
      setState({ data, error: null, isLoading: false, isError: false, isSuccess: true });
      return data;
    } catch (error) {
      setState({ data: null, error: error as Error, isLoading: false, isError: true, isSuccess: false });
      throw error;
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false, isError: false, isSuccess: false });
  }, []);

  return { ...state, mutate, reset };
}
