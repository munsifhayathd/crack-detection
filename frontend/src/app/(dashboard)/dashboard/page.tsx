"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentJobsTable } from "@/components/dashboard/recent-jobs-table";
import { CrackTypeChart } from "@/components/dashboard/crack-type-chart";
import { SeverityChart } from "@/components/dashboard/severity-chart";
import { mockStats, mockJobs } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Stats overview */}
      <StatsCards
        totalImages={mockStats.total_images}
        processedImages={mockStats.processed_images}
        failedImages={mockStats.failed_images}
        activeJobs={mockStats.active_jobs}
      />

      {/* Jobs table */}
      <RecentJobsTable jobs={mockJobs} />

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CrackTypeChart data={mockStats.crack_types} />
        <SeverityChart data={mockStats.severities} />
      </div>
    </div>
  );
}
