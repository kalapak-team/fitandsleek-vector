from __future__ import annotations

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import jwt
from fastapi import Depends, Header, HTTPException, Request
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import ApiKey, User

settings = get_settings()


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120_000)
    return f"{salt.hex()}:{digest.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        salt_hex, digest_hex = password_hash.split(":", 1)
        salt = bytes.fromhex(salt_hex)
        digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120_000)
        return secrets.compare_digest(digest.hex(), digest_hex)
    except Exception:
        return False


def hash_api_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()


def generate_api_key() -> str:
    # Qdrant-style opaque key with FitandSleek prefix
    return f"fsv_{secrets.token_urlsafe(32)}"


def create_access_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=settings.jwt_expire_hours),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc


def issue_api_key(db: Session, user: User, name: str = "Default key") -> tuple[ApiKey, str]:
    raw = generate_api_key()
    row = ApiKey(
        user_id=user.id,
        name=name,
        key_hash=hash_api_key(raw),
        key_prefix=raw[:12],
        role=user.role,
        is_active=True,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row, raw


def get_user_from_token(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = authorization.split(" ", 1)[1].strip()
    payload = decode_access_token(token)
    user = db.query(User).filter(User.id == int(payload["sub"]), User.is_active.is_(True)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def get_optional_api_principal(
    request: Request,
    db: Session = Depends(get_db),
    api_key: Optional[str] = Header(default=None, alias="api-key"),
    authorization: Optional[str] = Header(default=None),
) -> Optional[dict[str, Any]]:
    """Accept Qdrant-style `api-key` header or Bearer JWT."""
    raw_key = api_key or request.headers.get("x-api-key")
    if raw_key:
        key_row = (
            db.query(ApiKey)
            .filter(ApiKey.key_hash == hash_api_key(raw_key), ApiKey.is_active.is_(True))
            .first()
        )
        if not key_row:
            raise HTTPException(status_code=401, detail="Invalid API key")
        user = db.query(User).filter(User.id == key_row.user_id, User.is_active.is_(True)).first()
        if not user:
            raise HTTPException(status_code=401, detail="API key owner inactive")
        key_row.last_used_at = datetime.now(timezone.utc)
        db.commit()
        return {"type": "api_key", "user": user, "api_key": key_row, "role": key_row.role or user.role}

    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
        payload = decode_access_token(token)
        user = db.query(User).filter(User.id == int(payload["sub"]), User.is_active.is_(True)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"type": "jwt", "user": user, "api_key": None, "role": user.role}

    return None


def require_auth(
    principal: Optional[dict[str, Any]] = Depends(get_optional_api_principal),
) -> dict[str, Any]:
    if not settings.auth_required:
        return principal or {"type": "anon", "user": None, "api_key": None, "role": "admin"}
    if not principal:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized. Provide header `api-key: <your-key>` (Qdrant style) or Bearer token.",
        )
    return principal


def require_admin(principal: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    role = principal.get("role") or "customer"
    if role != "admin" and settings.auth_required:
        raise HTTPException(status_code=403, detail="Admin role required")
    return principal
