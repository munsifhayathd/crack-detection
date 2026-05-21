"use client";

import { useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submitWelcomeFeedback,
  type FeedbackCategory,
} from "@/lib/api/feedback";
import { cn } from "@/lib/utils";

const categories: { value: FeedbackCategory; label: string }[] = [
  { value: "onboarding", label: "Onboarding flow" },
  { value: "navigation", label: "Navigation" },
  { value: "content", label: "Page content" },
  { value: "other", label: "Other" },
  { value: "general", label: "General" },
];

const ratingLabels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

export function WelcomeFeedbackForm() {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>("onboarding");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 10) {
      toast.error("Please enter at least 10 characters of feedback.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitWelcomeFeedback({
        message: trimmed,
        rating: rating ?? undefined,
        category,
      });
      toast.success("Thank you — your feedback was submitted.");
      setMessage("");
      setRating(null);
      setCategory("onboarding");
    } catch {
      toast.error("Could not submit feedback. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="welcome-feedback"
      className="rounded-xl bg-card p-6 ring-1 ring-border"
      aria-labelledby="welcome-feedback-heading"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageSquareHeart className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 id="welcome-feedback-heading" className="text-lg font-semibold">
            Share your feedback
          </h3>
          <p className="text-sm text-muted-foreground">
            Help us improve this welcome experience. Your suggestions are stored
            for the team to review.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Overall experience (optional)</legend>
          <div className="flex flex-wrap gap-2">
            {ratingLabels.map((label, index) => {
              const value = index + 1;
              const selected = rating === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(selected ? null : value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                  aria-pressed={selected}
                >
                  {value}. {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="feedback-category">Topic</Label>
          <select
            id="feedback-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as FeedbackCategory)
            }
            className="h-8 w-full max-w-xs rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback-message">Your feedback</Label>
          <Textarea
            id="feedback-message"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="What helped on this page? What was confusing or missing?"
            required
            minLength={10}
            maxLength={2000}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            {message.trim().length}/2000 characters (minimum 10)
          </p>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit feedback"}
        </Button>
      </form>
    </section>
  );
}
