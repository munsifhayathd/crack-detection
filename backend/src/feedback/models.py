from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.db.base import Base


class WelcomeFeedback(Base):
    __tablename__ = "welcome_feedback"

    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    category: Mapped[str] = mapped_column(String(64), nullable=False, default="general")
    message: Mapped[str] = mapped_column(Text, nullable=False)
    page: Mapped[str] = mapped_column(String(64), nullable=False, default="welcome")
