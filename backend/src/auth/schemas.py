from pydantic import BaseModel, EmailStr


class TokenPayload(BaseModel):
    sub: str
    exp: int
    type: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str
