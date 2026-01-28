from fastapi import APIRouter, status

from src.core.database import DatabaseSession

from .dependencies import CurrentUser
from .schemas import MeResponse, TokenResponse, LoginRequest, RegisterRequest
from .service import get_current_user_info, login_user, register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: DatabaseSession):
    """Registra um novo usuario."""
    return register_user(payload, db)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: DatabaseSession):
    """Autentica um usuario e retorna o token JWT."""
    return login_user(payload, db)


@router.get("/me", response_model=MeResponse)
def get_me(current_user: CurrentUser, db: DatabaseSession):
    """Retorna o usuario autenticado com suas memberships."""
    return get_current_user_info(current_user, db)
