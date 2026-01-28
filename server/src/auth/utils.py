from datetime import UTC, datetime, timedelta

import bcrypt
import jwt
from fastapi.security import HTTPBearer

from src.core.env import jwt_algorithm, jwt_expiration_hours, jwt_secret

# Bearer token scheme
bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    """Gera hash bcrypt da senha."""
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha corresponde ao hash."""
    password_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(user_id: str, expires_delta: timedelta | None = None) -> str:
    """Cria JWT token para o usuario."""
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(hours=jwt_expiration_hours)

    to_encode = {
        "sub": user_id,
        "exp": expire,
        "iat": datetime.now(UTC),
    }
    return jwt.encode(to_encode, jwt_secret, algorithm=jwt_algorithm)


def decode_token(token: str) -> dict | None:
    """Decodifica e valida JWT token."""
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=[jwt_algorithm])
        return payload
    except jwt.PyJWTError:
        return None
