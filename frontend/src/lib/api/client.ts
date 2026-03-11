import { apiConfig } from "@/config/api";
import { apiLogger } from "@/lib/logger";
import { ApiError, NetworkError, TimeoutError } from "./errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

interface RequestConfig extends RequestOptions {
  method: HttpMethod;
  body?: unknown;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildUrl(endpoint: string, params?: RequestOptions["params"]): string {
  const url = new URL(`${apiConfig.baseUrl}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request<T>(endpoint: string, config: RequestConfig): Promise<T> {
  const {
    method,
    body,
    params,
    headers = {},
    timeout = apiConfig.timeout,
    retries = apiConfig.retryAttempts,
    signal,
  } = config;

  const url = buildUrl(endpoint, params);
  const requestId = Math.random().toString(36).substring(7);

  apiLogger.debug(`[${requestId}] ${method} ${endpoint}`, { params, body });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      if (signal?.aborted) throw new Error("Aborted");

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      let data: unknown;
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = ApiError.fromResponse(response, data);
        if ((apiConfig.retryStatusCodes as readonly number[]).includes(response.status) && attempt < retries) {
          apiLogger.warn(`[${requestId}] Retry ${attempt + 1}/${retries} after ${response.status}`);
          await sleep(apiConfig.retryDelay * (attempt + 1));
          lastError = error;
          continue;
        }
        throw error;
      }

      apiLogger.info(`[${requestId}] ${method} ${endpoint} -> ${response.status}`);
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) throw error;

      if (error instanceof TypeError && error.message.includes("fetch")) {
        if (attempt < retries) {
          await sleep(apiConfig.retryDelay * (attempt + 1));
          lastError = new NetworkError();
          continue;
        }
        throw new NetworkError();
      }

      if ((error as Error).name === "AbortError") {
        throw new TimeoutError();
      }

      throw error;
    }
  }

  throw lastError || new Error("Request failed after all retries");
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "POST", body, ...options }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PUT", body, ...options }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PATCH", body, ...options }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};
