type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
  error?: Error;
}

const LOG_COLORS = {
  debug: "#9CA3AF",
  info: "#3B82F6",
  warn: "#F59E0B",
  error: "#EF4444",
} as const;

class Logger {
  private context?: string;
  private enabled: boolean;

  constructor(options: { context?: string; enabled?: boolean } = {}) {
    this.context = options.context;
    this.enabled = options.enabled ?? process.env.NODE_ENV !== "production";
  }

  private formatEntry(entry: LogEntry): void {
    if (!this.enabled) return;

    const prefix = entry.context ? `[${entry.context}]` : "";
    const color = LOG_COLORS[entry.level];

    if (typeof window !== "undefined") {
      const style = `color: ${color}; font-weight: bold;`;
      console.groupCollapsed(
        `%c${entry.level.toUpperCase()} ${prefix} ${entry.message}`,
        style
      );
      console.log("Timestamp:", entry.timestamp);
      if (entry.data) console.log("Data:", entry.data);
      if (entry.error) console.error("Error:", entry.error);
      console.groupEnd();
    } else {
      console.log(JSON.stringify(entry, null, 2));
    }
  }

  private log(level: LogLevel, message: string, data?: unknown, error?: Error) {
    this.formatEntry({
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      data,
      error,
    });
  }

  debug(message: string, data?: unknown) { this.log("debug", message, data); }
  info(message: string, data?: unknown) { this.log("info", message, data); }
  warn(message: string, data?: unknown) { this.log("warn", message, data); }
  error(message: string, error?: Error, data?: unknown) { this.log("error", message, data, error); }

  child(context: string): Logger {
    return new Logger({
      context: this.context ? `${this.context}:${context}` : context,
      enabled: this.enabled,
    });
  }
}

export const logger = new Logger();
export const createLogger = (context: string) => new Logger({ context });
export const apiLogger = createLogger("API");
