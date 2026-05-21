import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Database,
  LayoutDashboard,
  Map,
  Scan,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const workflowSteps = [
  {
    step: "1",
    title: "Upload your survey data",
    description:
      "Import a CSV file that lists road or surface images along with GPS coordinates and related metadata.",
  },
  {
    step: "2",
    title: "Process images in batches",
    description:
      "Select rows to analyze and run crack detection in manageable batches. Track progress as each batch completes.",
  },
  {
    step: "3",
    title: "Review results",
    description:
      "Use the dashboard, map, and job views to explore detections, severity levels, and crack classifications.",
  },
];

const featureGuides = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "See processing totals, recent jobs, and charts that summarize crack types and severity across your data.",
  },
  {
    href: "/upload",
    icon: Upload,
    title: "Upload",
    description:
      "Upload CSV files, preview rows, choose which images to process, and run batch detection jobs.",
  },
  {
    href: "/data",
    icon: Database,
    title: "Data",
    description:
      "Browse loaded survey records, inspect coordinate coverage, and review the full dataset in a table.",
  },
  {
    href: "/map",
    icon: Map,
    title: "Map View",
    description:
      "Visualize detections on an interactive map. Filter by severity and inspect individual crack locations.",
  },
  {
    href: "/jobs-portfolio",
    icon: Briefcase,
    title: "Jobs Portfolio",
    description:
      "Track detection jobs across sites, monitor status and progress, and open job details when available.",
  },
];

export function OnboardingContent() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 animate-fade-up">
      <section className="relative overflow-hidden rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
        <div className="relative space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Scan className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Welcome to CrackDetect
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Road and surface crack detection for infrastructure teams
              </p>
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            CrackDetect helps you turn survey imagery into actionable inspection
            insights. Upload image metadata from field surveys, run automated
            crack detection, and explore results through charts, tables, and an
            interactive map. Use the sidebar on the left to move between sections
            at any time.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">How it works</h3>
          <p className="text-sm text-muted-foreground">
            Follow these steps to go from raw survey data to reviewed detections.
          </p>
        </div>
        <ol className="stagger-children grid gap-4 md:grid-cols-3">
          {workflowSteps.map((item) => (
            <li
              key={item.step}
              className="rounded-xl bg-card p-5 ring-1 ring-border"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                {item.step}
              </span>
              <h4 className="mt-3 text-sm font-semibold">{item.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Explore the app</h3>
          <p className="text-sm text-muted-foreground">
            Each section supports a different part of your inspection workflow.
          </p>
        </div>
        <div className="stagger-children grid gap-4 sm:grid-cols-2">
          {featureGuides.map((feature) => (
            <Card
              key={feature.href}
              className="transition-all hover:ring-primary/30"
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <feature.icon className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href={feature.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Go to {feature.title}
                  <ArrowRight className="size-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-card p-6 ring-1 ring-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Ready to get started?</h3>
            <p className="text-sm text-muted-foreground">
              Upload a CSV to begin processing, or open the dashboard to review
              existing activity.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/upload">
              <Button className="w-full gap-2 sm:w-auto">
                Upload data
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto">
                View dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
