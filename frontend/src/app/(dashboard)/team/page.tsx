export default function TeamPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Team workspace</h2>
        <p className="text-sm text-muted-foreground">
          Configure team settings, permissions, and shared inspection workflows.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Active members
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">4</p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Shared jobs
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">12</p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border sm:col-span-2 xl:col-span-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Pending invites
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">0</p>
        </div>
      </div>
    </div>
  );
}
