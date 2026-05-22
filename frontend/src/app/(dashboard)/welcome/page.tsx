import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="rounded-xl bg-card p-8 ring-1 ring-border">
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome to CrackDetect
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Upload road and surface survey data, run crack detection in batches,
          and explore results on the dashboard and map.
        </p>
        <Link href="/upload" className="mt-6 inline-block">
          <Button className="gap-2">
            Get started
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
