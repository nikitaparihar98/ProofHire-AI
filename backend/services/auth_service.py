import base64
import time
import logging
import hashlib
import hmac
import json
import os
from typing import Dict

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.core.database import get_db
from backend.models import models

security = HTTPBearer()


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100_000,
    )
    result = f"{_b64encode(salt)}:{_b64encode(password_hash)}"
    return result


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt_value, hash_value = stored_hash.split(":", 1)
        salt = _b64decode(salt_value)
        expected_hash = _b64decode(hash_value)
    except ValueError:
        return False

    candidate_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100_000,
    )
    return hmac.compare_digest(candidate_hash, expected_hash)


def create_access_token(user: models.User) -> str:
    payload = {
        "sub": user.id,
        "role": user.role,
        "exp": int(time.time()) + 7 * 24 * 60 * 60,
    }
    payload_value = _b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = _sign(payload_value)
    return f"{payload_value}.{signature}"


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> models.User:
    payload = _decode_token(credentials.credentials)
    user = db.query(models.User).filter(models.User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def require_role(user: models.User, role: str) -> None:
    if user.role.lower() != role.lower():
        raise HTTPException(status_code=403, detail=f"{role.title()} access required")


def _decode_token(token: str) -> Dict:
    try:
        payload_value, signature = token.split(".", 1)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    expected_signature = _sign(payload_value)
    if not hmac.compare_digest(signature, expected_signature):
        raise HTTPException(status_code=401, detail="Invalid token signature")

    try:
        payload = json.loads(_b64decode(payload_value))
    except (ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=401, detail="Invalid token payload") from exc

    if int(payload.get("exp", 0)) < int(time.time()):
        raise HTTPException(status_code=401, detail="Token expired")

    return payload


def _sign(value: str) -> str:
    signature = hmac.new(
        settings.AUTH_SECRET.encode("utf-8"),
        value.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return _b64encode(signature)


def _b64encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("utf-8").rstrip("=")


def _b64decode(value: str) -> bytes:
    padded_value = value + "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(padded_value.encode("utf-8"))
