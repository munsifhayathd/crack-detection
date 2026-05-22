import { Scan } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function WelcomeSidebar() {
  return (
    <aside
      aria-label="welcome"
      className="flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-border"
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
            <Scan className="size-3.5 text-primary" />
          </div>
          <div>
            <h2 className="text-xs font-medium lowercase text-foreground">
              welcome
            </h2>
            <p className="text-[10px] lowercase text-muted-foreground">
              crack detection
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 px-4 py-4">
          <section className="space-y-2">
            <h3 className="text-xs font-medium lowercase text-foreground">
              welcome to crackdetect
            </h3>
            <p className="text-xs lowercase leading-relaxed text-muted-foreground">
              crackdetect helps you process road and surface survey imagery to
              detect, classify, and map cracks for infrastructure inspection
              teams.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] font-medium lowercase tracking-wider text-muted-foreground">
              about this project
            </h3>
            <p className="text-xs lowercase leading-relaxed text-muted-foreground">
              upload csv files with image metadata and gps coordinates, run batch
              crack detection, and explore results on the dashboard and
              interactive map.
            </p>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
