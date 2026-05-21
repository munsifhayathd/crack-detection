import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.db.base import Base
from src.db.session import get_session
from src.main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture
async def client() -> AsyncClient:
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async def override_get_session():
        async with session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[get_session] = override_get_session

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.mark.asyncio
async def test_submit_feedback(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/feedback/",
        json={
            "message": "The welcome page workflow steps are clear and easy to follow.",
            "rating": 4,
            "category": "onboarding",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["rating"] == 4
    assert data["category"] == "onboarding"
    assert data["page"] == "welcome"


@pytest.mark.asyncio
async def test_submit_feedback_rejects_short_message(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/feedback/",
        json={"message": "too short"},
    )
    assert response.status_code == 422
