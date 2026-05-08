// Shared API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Processing job
export interface ProcessingJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  total_images: number;
  processed_count: number;
  failed_count: number;
  created_at: string;
  completed_at: string | null;
}

/** Mock portfolio row (presentation-only; not from API). */
export interface PortfolioJob {
  id: string;
  siteName: string;
  status: ProcessingJob["status"];
  total_images: number;
  processed_count: number;
  failed_count: number;
  created_at: string;
  severityCounts: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

// Individual crack analysis result
export interface CrackResult {
  id: string;
  job_id: string;
  image_index: number;
  latitude: number;
  longitude: number;
  timestamp: string | null;
  crack_type: string | null;
  severity: string | null;
  confidence: number | null;
  metadata: Record<string, unknown>;
  status: "pending" | "processed" | "failed";
  error_message: string | null;
  created_at: string;
}

// CSV row (generic — adapts to whatever columns exist)
export interface CsvRow {
  [key: string]: string;
}

// Dashboard stats
export interface DashboardStats {
  total_images: number;
  processed_images: number;
  failed_images: number;
  active_jobs: number;
  crack_types: Record<string, number>;
  severities: Record<string, number>;
}
