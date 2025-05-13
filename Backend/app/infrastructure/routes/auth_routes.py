from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.application.services.auth_service import AuthService
from app.infrastructure.repositories.usuario_repository_sql import UsuarioRepositorySQL
from app.infrastructure.security.security import Security
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.infrastructure.observers.bienvenida_observer import BienvenidaObserver

from app.infrastructure.schemas.auth_schema import (
    EmpresaCreate,
    AdminCreate,
    LoginRequest,
    LoginResponse,
    UsuarioOut
)

router = APIRouter(prefix="/auth", tags=["Autenticación"])
db_provider = DBSessionProvider()


def get_auth_service(db: Session = Depends(db_provider.get_db)) -> AuthService:
    repo = UsuarioRepositorySQL(db)
    security = Security()
    service = AuthService(repo, security)
    service.agregar_observer(BienvenidaObserver())
    return service


@router.post("/register/empresa", response_model=UsuarioOut)
def registrar_empresa(
    empresa: EmpresaCreate,
    service: AuthService = Depends(get_auth_service)
):
    usuario = service.registrar_usuario(empresa)
    return usuario


@router.post("/register/admin", response_model=UsuarioOut)
def registrar_admin(
    admin: AdminCreate,
    service: AuthService = Depends(get_auth_service)
):
    usuario = service.registrar_usuario(admin)
    return usuario


@router.post("/login", response_model=LoginResponse)
def login(
    login_data: LoginRequest,
    service: AuthService = Depends(get_auth_service)
):
    return service.login_usuario(login_data)
