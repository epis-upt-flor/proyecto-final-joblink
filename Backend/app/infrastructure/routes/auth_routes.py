from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.domain.interfaces.internal.auth_usecase import AuthUseCase

from app.application.services.auth_service import AuthService
from app.domain.models.administrador import Administrador
from app.domain.models.empresa import Empresa
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

# 💉 Dependency injection


def get_auth_service(db: Session = Depends(db_provider.get_db)) -> AuthUseCase:
    repo = UsuarioRepositorySQL(db)
    security = Security()
    service = AuthService(repo, security)
    service.agregar_observer(BienvenidaObserver())
    return service

# 📌 Endpoints


@router.post("/register/empresa", response_model=UsuarioOut)
def registrar_empresa(
    empresa: EmpresaCreate,
    service: AuthUseCase = Depends(get_auth_service)
):
    return service.registrar_usuario(empresa)


@router.post("/register/admin", response_model=UsuarioOut)
def registrar_admin(
    admin: AdminCreate,
    service: AuthUseCase = Depends(get_auth_service)
):
    return service.registrar_usuario(admin)


@router.post("/login", response_model=LoginResponse)
def login(
    login_data: LoginRequest,
    service: AuthUseCase = Depends(get_auth_service)
):
    return service.login_usuario(login_data)
