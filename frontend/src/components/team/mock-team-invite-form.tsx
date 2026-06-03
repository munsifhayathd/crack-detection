"use client";

import { useState } from "react";
import { CheckCircle2, Mail, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

type SentInvite = {
  id: string;
  email: string;
};

export function MockTeamInviteForm() {
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [sentInvites, setSentInvites] = useState<SentInvite[]>([]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      setInputError("Please enter an email address.");
      return;
    }

    if (!isValidEmail(trimmed)) {
      setInputError("Please enter a valid email address.");
      return;
    }

    setSentInvites((previous) => [
      ...previous,
      { id: crypto.randomUUID(), email: trimmed },
    ]);
    setEmail("");
    setInputError(null);
  }

  return (
    <section
      className="mx-auto max-w-lg space-y-6 rounded-xl bg-card p-6 ring-1 ring-border"
      aria-labelledby="team-invite-heading"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserPlus className="size-5" />
        </div>
        <div className="space-y-1">
          <h2 id="team-invite-heading" className="text-lg font-semibold">
            Invite team members
          </h2>
          <p className="text-sm text-muted-foreground">
            Send mock invitations to colleagues. Each submission shows an
            immediate confirmation—no account or server setup required.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="team-invite-email">Email address</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="team-invite-email"
                type="email"
                name="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (inputError) {
                    setInputError(null);
                  }
                }}
                placeholder="colleague@example.com"
                autoComplete="email"
                className="pl-8"
                aria-invalid={inputError ? true : undefined}
                aria-describedby={
                  inputError ? "team-invite-email-error" : undefined
                }
              />
            </div>
            <Button type="submit">Send invite</Button>
          </div>
          {inputError ? (
            <p
              id="team-invite-email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {inputError}
            </p>
          ) : null}
        </div>
      </form>

      {sentInvites.length > 0 ? (
        <div className="space-y-3" aria-live="polite">
          <h3 className="text-sm font-medium">Sent invitations</h3>
          <ul className="space-y-2">
            {sentInvites.map((invite) => (
              <li key={invite.id}>
                <Alert className="border-emerald-500/30 bg-emerald-500/5">
                  <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />
                  <AlertTitle>Invitation sent</AlertTitle>
                  <AlertDescription>
                    A mock invitation was sent to{" "}
                    <span className="font-medium text-foreground">
                      {invite.email}
                    </span>
                    . They will see this invite when team accounts are enabled.
                  </AlertDescription>
                </Alert>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
