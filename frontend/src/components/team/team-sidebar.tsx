"use client";

import { Crown, Shield, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface TeamMember {
  id: string;
  name: string;
  role: "owner" | "admin" | "member";
  initials: string;
}

const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "Alex Rivera", role: "owner", initials: "AR" },
  { id: "2", name: "Jordan Lee", role: "admin", initials: "JL" },
  { id: "3", name: "Sam Chen", role: "member", initials: "SC" },
  { id: "4", name: "Taylor Brooks", role: "member", initials: "TB" },
];

const roleLabels: Record<TeamMember["role"], string> = {
  owner: "owner",
  admin: "admin",
  member: "member",
};

const roleIcons: Record<TeamMember["role"], typeof Crown> = {
  owner: Crown,
  admin: Shield,
  member: Users,
};

interface TeamSidebarProps {
  className?: string;
}

export function TeamSidebar({ className }: TeamSidebarProps) {
  return (
    <aside
      aria-label="team"
      className={cn(
        "flex h-full max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-xl bg-card ring-1 ring-border",
        className
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
            <Users className="size-3.5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xs font-medium lowercase text-foreground">
              team
            </h2>
            <p className="truncate text-[10px] lowercase text-muted-foreground">
              inspection team alpha
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 font-mono text-[10px]">
            {mockTeamMembers.length}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 px-4 py-4">
          <section className="space-y-2">
            <h3 className="text-xs font-medium lowercase text-foreground">
              team overview
            </h3>
            <p className="text-xs lowercase leading-relaxed text-muted-foreground">
              manage members, roles, and collaboration settings for your crack
              detection workspace.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] font-medium lowercase tracking-wider text-muted-foreground">
              members
            </h3>
            <ul className="space-y-1.5">
              {mockTeamMembers.map((member) => {
                const RoleIcon = roleIcons[member.role];
                return (
                  <li
                    key={member.id}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs lowercase text-foreground">
                        {member.name}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] lowercase text-muted-foreground">
                        <RoleIcon className="size-2.5" />
                        <span>{roleLabels[member.role]}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-[10px] font-medium lowercase tracking-wider text-muted-foreground">
              quick actions
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start lowercase"
              disabled
            >
              <UserPlus className="size-3.5" />
              invite member
            </Button>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
