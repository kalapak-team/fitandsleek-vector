from datetime import datetime
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ApiKey, User
from app.services.auth import (
    create_access_token,
    get_user_from_token,
    hash_password,
    issue_api_key,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    full_name: str = Field(default="", max_length=255)
    role: Literal["admin", "customer"] = "customer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CreateKeyRequest(BaseModel):
    name: str = Field(default="New key", max_length=255)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    created_at: Optional[datetime] = None


class ApiKeyOut(BaseModel):
    id: int
    name: str
    key_prefix: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None
    last_used_at: Optional[datetime] = None


@router.post("/register")
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email.lower()).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    # First user becomes admin automatically (bootstrap)
    user_count = db.query(User).count()
    role = "admin" if user_count == 0 else body.role

    user = User(
        email=body.email.lower(),
        full_name=body.full_name or body.email.split("@")[0],
        password_hash=hash_password(body.password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    key_row, raw_key = issue_api_key(db, user, name="Default key")
    token = create_access_token(user)

    return {
        "result": {
            "user": UserOut.model_validate(user, from_attributes=True).model_dump(),
            "access_token": token,
            "token_type": "bearer",
            "api_key": raw_key,  # shown once, like Qdrant Cloud
            "api_key_info": ApiKeyOut.model_validate(key_row, from_attributes=True).model_dump(),
            "message": "Save your API key now. It will not be shown again.",
        },
        "status": "ok",
        "time": 0,
    }


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower(), User.is_active.is_(True)).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    keys = (
        db.query(ApiKey)
        .filter(ApiKey.user_id == user.id, ApiKey.is_active.is_(True))
        .order_by(ApiKey.created_at.desc())
        .all()
    )
    token = create_access_token(user)
    return {
        "result": {
            "user": UserOut.model_validate(user, from_attributes=True).model_dump(),
            "access_token": token,
            "token_type": "bearer",
            "api_keys": [ApiKeyOut.model_validate(k, from_attributes=True).model_dump() for k in keys],
            "message": "Use an existing API key header, or create a new key to reveal a fresh secret.",
        },
        "status": "ok",
        "time": 0,
    }


@router.get("/me")
def me(user: User = Depends(get_user_from_token)):
    return {
        "result": UserOut.model_validate(user, from_attributes=True).model_dump(),
        "status": "ok",
        "time": 0,
    }


@router.get("/keys")
def list_keys(user: User = Depends(get_user_from_token), db: Session = Depends(get_db)):
    keys = (
        db.query(ApiKey)
        .filter(ApiKey.user_id == user.id)
        .order_by(ApiKey.created_at.desc())
        .all()
    )
    return {
        "result": [ApiKeyOut.model_validate(k, from_attributes=True).model_dump() for k in keys],
        "status": "ok",
        "time": 0,
    }


@router.post("/keys")
def create_key(
    body: CreateKeyRequest,
    user: User = Depends(get_user_from_token),
    db: Session = Depends(get_db),
):
    key_row, raw_key = issue_api_key(db, user, name=body.name)
    return {
        "result": {
            "api_key": raw_key,
            "api_key_info": ApiKeyOut.model_validate(key_row, from_attributes=True).model_dump(),
            "message": "Save your API key now. It will not be shown again.",
        },
        "status": "ok",
        "time": 0,
    }


@router.delete("/keys/{key_id}")
def revoke_key(key_id: int, user: User = Depends(get_user_from_token), db: Session = Depends(get_db)):
    row = db.query(ApiKey).filter(ApiKey.id == key_id, ApiKey.user_id == user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="API key not found")
    row.is_active = False
    db.commit()
    return {"result": True, "status": "ok", "time": 0}
