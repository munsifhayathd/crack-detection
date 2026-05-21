from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

FeedbackCategory = Literal["onboarding", "navigation", "content", "other", "general"]


class FeedbackCreate(BaseModel):
    message: str = Field(..., min_length=10, max_length=2000)
    rating: int | None = Field(None, ge=1, le=5)
    category: FeedbackCategory = "general"
    page: str = Field(default="welcome", max_length=64)


class FeedbackResponse(BaseModel):
    id: int
    rating: int | None
    category: str
    message: str
    page: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
