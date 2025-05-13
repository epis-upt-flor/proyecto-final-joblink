# app/application/services/recuperacion_service.py
from uuid import uuid4
from app.domain.interfaces.internal.recuperacion_usecase import RecuperacionUseCase
from app.domain.interfaces.external.usuario_repository import IUsuarioRepository
from app.domain.interfaces.external.security import ISecurity
from app.domain.interfaces.external.email_sender import IEmailSender
from app.domain.interfaces.external.cache import ICache
from fastapi import HTTPException


class RecuperacionService(RecuperacionUseCase):
    def __init__(
        self,
        usuario_repo: IUsuarioRepository,
        security: ISecurity,
        cache: ICache,
        email_sender: IEmailSender
    ):
        self.usuario_repo = usuario_repo
        self.security = security
        self.cache = cache
        self.email_sender = email_sender

    def generar_token_y_enviar(self, email: str) -> dict:
        usuario = self.usuario_repo.obtener_por_email(email)
        if not usuario:
            raise HTTPException(
                status_code=404, detail="Usuario no encontrado")

        token = str(uuid4()).split("-")[0]
        self.cache.set(f"recuperar:{token}", usuario.id, ex=600)
        self.email_sender.send(to=email, token=token)

        return {"message": "Token enviado"}

    def cambiar_contrasena_con_token(self, token: str, nueva_contrasena: str) -> dict:
        user_id = self.cache.get(f"recuperar:{token}")
        if not user_id:
            raise HTTPException(
                status_code=400, detail="Token inválido o expirado")

        usuario = self.usuario_repo.obtener_por_id(int(user_id))
        if not usuario:
            raise HTTPException(
                status_code=404, detail="Usuario no encontrado")

        usuario.password = self.security.generar_hash(nueva_contrasena)
        self.usuario_repo.actualizar(usuario)
        self.cache.delete(f"recuperar:{token}")

        return {"message": "Contraseña actualizada correctamente"}
