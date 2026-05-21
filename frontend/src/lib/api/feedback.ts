import { api } from "@/lib/api/client";

export type FeedbackCategory =
  | "onboarding"
  | "navigation"
  | "content"
  | "other"
  | "general";

export interface FeedbackSubmission {
  message: string;
  rating?: number;
  category: FeedbackCategory;
  page?: string;
}

export interface FeedbackRecord extends FeedbackSubmission {
  id: number;
  created_at: string;
  updated_at: string;
}

export async function submitWelcomeFeedback(
  payload: FeedbackSubmission
): Promise<FeedbackRecord> {
  return api.post<FeedbackRecord>("/feedback/", {
    ...payload,
    page: payload.page ?? "welcome",
  });
}
