"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

const pageLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/upload": "Upload & Process",
  "/map": "Map View",
  "/jobs-portfolio": "Jobs Portfolio",
};

const pageSubtitles: Partial<Record<string, string>> = {
  "/jobs-portfolio": "// detection jobs across active sites",
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const title = pageLabels[pathname] || "Crack Detection";
  const subtitle =
    pageSubtitles[pathname] ?? "// infrastructure monitoring";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold tracking-tight">{title}</h1>
        <span className="hidden text-xs text-muted-foreground sm:inline-block font-mono">
          {subtitle.replace(/ /g, "\u00a0")}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
          <Bell className="size-4" />
        </Button>
        {mounted && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
