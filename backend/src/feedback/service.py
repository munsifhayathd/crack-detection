from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.feedback.models import WelcomeFeedback
from src.feedback.schemas import FeedbackCreate


async def create_feedback(db: AsyncSession, feedback_in: FeedbackCreate) -> WelcomeFeedback:
    feedback = WelcomeFeedback(
        rating=feedback_in.rating,
        category=feedback_in.category,
        message=feedback_in.message.strip(),
        page=feedback_in.page,
    )
    db.add(feedback)
    await db.flush()
    await db.refresh(feedback)
    return feedback


async def list_feedback(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[WelcomeFeedback]:
    result = await db.execute(
        select(WelcomeFeedback).order_by(WelcomeFeedback.created_at.desc()).offset(skip).limit(limit)
    )
    return list(result.scalars().all())
