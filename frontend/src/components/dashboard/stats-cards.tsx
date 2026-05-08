"use client";

import {
  ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent: string;
  delay: number;
}

function StatCard({ label, value, icon: Icon, accent, delay }: StatCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-card p-5 ring-1 ring-border transition-all hover:ring-2 hover:ring-primary/30"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight font-mono tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
            accent
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      {/* Bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] w-full opacity-60",
          accent.replace("bg-", "bg-").replace("/15", "")
        )}
      />
    </div>
  );
}

interface StatsCardsProps {
  totalImages: number;
  processedImages: number;
  failedImages: number;
  activeJobs: number;
}

export function StatsCards({
  totalImages,
  processedImages,
  failedImages,
  activeJobs,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Total Images",
      value: totalImages,
      icon: ImageIcon,
      accent: "bg-primary/15 text-primary",
    },
    {
      label: "Processed",
      value: processedImages,
      icon: CheckCircle2,
      accent: "bg-severity-low/15 text-severity-low",
    },
    {
      label: "Failed",
      value: failedImages,
      icon: AlertTriangle,
      accent: "bg-severity-critical/15 text-severity-critical",
    },
    {
      label: "Active Jobs",
      value: activeJobs,
      icon: Activity,
      accent: "bg-cyan-accent/15 text-cyan-accent",
    },
    {
      label: "Avg Confidence",
      value: "94.2%",
      icon: Target,
      accent: "bg-chart-2/15 text-chart-2",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 stagger-children">
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} delay={i * 60} />
      ))}
    </div>
  );
}
