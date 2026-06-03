"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TeamSidebar } from "@/components/team/team-sidebar";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

function isTeamRoute(pathname: string) {
  return pathname === "/team" || pathname.startsWith("/team/");
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const showTeamSidebar = isTeamRoute(pathname);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "pl-16" : "pl-56"
        )}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 topo-pattern">
          <div
            className={cn(
              showTeamSidebar && "flex flex-col gap-4 lg:flex-row lg:gap-6"
            )}
          >
            {showTeamSidebar && (
              <div className="w-full shrink-0 lg:w-72">
                <div className="lg:sticky lg:top-20">
                  <TeamSidebar />
                </div>
              </div>
            )}
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
