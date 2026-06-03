import { MockTeamInviteForm } from "@/components/team/mock-team-invite-form";

export default function TeamPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="text-sm text-muted-foreground">
          Invite colleagues to collaborate on crack detection surveys.
        </p>
      </div>
      <MockTeamInviteForm />
    </div>
  );
}
