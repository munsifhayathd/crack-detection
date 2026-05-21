from fastapi import APIRouter, status

from src.auth.dependencies import CurrentSuperuser, DbSession
from src.feedback import service
from src.feedback.schemas import FeedbackCreate, FeedbackResponse

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(feedback_in: FeedbackCreate, db: DbSession) -> FeedbackResponse:
    return await service.create_feedback(db, feedback_in)


@router.get("/", response_model=list[FeedbackResponse])
async def list_feedback(
    db: DbSession,
    current_user: CurrentSuperuser,
    skip: int = 0,
    limit: int = 100,
) -> list[FeedbackResponse]:
    return await service.list_feedback(db, skip=skip, limit=limit)
