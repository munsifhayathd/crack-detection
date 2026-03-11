from fastapi import APIRouter
from src.auth.dependencies import CurrentSuperuser, CurrentUser, DbSession
from src.users import service
from src.users.schemas import UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user: CurrentUser) -> UserResponse:
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_current_user(user_in: UserUpdate, current_user: CurrentUser, db: DbSession) -> UserResponse:
    return await service.update_user(db, current_user.id, user_in)


@router.get("/", response_model=list[UserResponse])
async def read_users(db: DbSession, current_user: CurrentSuperuser, skip: int = 0, limit: int = 100) -> list[UserResponse]:
    return await service.get_users(db, skip=skip, limit=limit)


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(user_in: UserCreate, db: DbSession, current_user: CurrentSuperuser) -> UserResponse:
    return await service.create_user(db, user_in)


@router.get("/{user_id}", response_model=UserResponse)
async def read_user(user_id: int, db: DbSession, current_user: CurrentSuperuser) -> UserResponse:
    return await service.get_user_by_id(db, user_id)


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int, db: DbSession, current_user: CurrentSuperuser) -> None:
    await service.delete_user(db, user_id)
