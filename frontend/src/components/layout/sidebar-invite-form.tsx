"use client";

import { useId, useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidEmail, normalizeEmail } from "@/lib/validation/email";
import { cn } from "@/lib/utils";

const INVALID_EMAIL_MESSAGE = "Enter a valid email address.";

export function SidebarInviteForm() {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const successId = `${fieldId}-success`;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleEmailChange(value: string) {
    setEmail(value);
    setSuccess(null);
    if (submitted) {
      setError(value.trim() && !isValidEmail(value) ? INVALID_EMAIL_MESSAGE : null);
    } else {
      setError(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setSuccess(null);

    if (!isValidEmail(email)) {
      setError(INVALID_EMAIL_MESSAGE);
      return;
    }

    const normalized = normalizeEmail(email);
    setError(null);
    setSuccess(`Invitation sent to ${normalized}.`);
    setEmail("");
    setSubmitted(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "sidebar-invite-form space-y-2 border-t border-sidebar-border p-3",
        "normal-case font-normal not-italic"
      )}
    >
      <fieldset className="space-y-2">
        <legend className="mb-1.5 w-full text-xs font-medium text-sidebar-foreground/80">
          Invite team member
        </legend>
      <div className="space-y-1.5">
        <Label
          htmlFor={fieldId}
          className="text-xs text-sidebar-foreground/80"
        >
          Email
        </Label>
        <Input
          id={fieldId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="name@company.com"
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? errorId : success ? successId : undefined
          }
          className="bg-sidebar-accent/30 text-sidebar-foreground placeholder:text-sidebar-foreground/40"
        />
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-destructive"
          >
            {error}
          </p>
        ) : null}
        {success ? (
          <p
            id={successId}
            role="status"
            className="text-xs text-sidebar-primary"
          >
            {success}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="sm"
        className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
      >
        <UserPlus className="size-3.5" aria-hidden="true" />
        Send invite
      </Button>
      </fieldset>
    </form>
  );
}
