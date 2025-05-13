from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.infrastructure.schemas.recuperacion_schema import EmailRequest, CambioPasswordRequest
from app.infrastructure.database.db_session_provider import DBSessionProvider

from app.domain.interfaces.internal.recuperacion_usecase import RecuperacionUseCase

from app.infrastructure.repositories.usuario_repository_sql import UsuarioRepositorySQL
from app.infrastructure.security.security import Security
from app.infrastructure.cache.redis_client import RedisClient
from app.infrastructure.factories.email_factory import EmailFactory
from app.application.services.recuperacion_service import RecuperacionService

router = APIRouter(prefix="/recuperacion", tags=["Recuperación"])
db_provider = DBSessionProvider()

# --------- 💉 Dependencias ---------

def get_recuperacion_service(db: Session = Depends(db_provider.get_db)) -> RecuperacionUseCase:
    usuario_repo = UsuarioRepositorySQL(db)
    cache = RedisClient()
    email_sender = EmailFactory.get("recuperacion")
    security = Security()
    return RecuperacionService(usuario_repo, security, cache, email_sender)

# --------- 🔐 Endpoints ---------

@router.post("/solicitar/")
def solicitar_token(payload: EmailRequest, service: RecuperacionUseCase = Depends(get_recuperacion_service)):
    return service.generar_token_y_enviar(payload.email)


@router.post("/cambiar/")
def cambiar_password(payload: CambioPasswordRequest, service: RecuperacionUseCase = Depends(get_recuperacion_service)):
    return service.cambiar_contrasena_con_token(payload.token, payload.nueva_contrasena)
