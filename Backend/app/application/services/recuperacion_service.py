from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError

from app.domain.interfaces.internal.recuperacion_usecase import RecuperacionUseCase
from app.domain.interfaces.external.usuario_repository import IUsuarioRepository
from app.domain.interfaces.external.security import ISecurity
from app.domain.strategies.email_sender import IEmailSender
from app.domain.interfaces.external.cache import ICache
from fastapi import HTTPException
from app.config.config import SECRET_KEY, ALGORITHM

TOKEN_EXPIRE_SECONDS = 600

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
                status_code=404, detail="Usuario no encontrado"
            )

        exp = datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRE_SECONDS)

        token_payload = {
            "sub": str(usuario.id),
            "exp": exp
        }

        token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

        self.cache.set(f"recuperar:{usuario.id}", token, ex=TOKEN_EXPIRE_SECONDS)

        self.email_sender.send(to=email, token=token)

        return {"message": "Token enviado"}

    def cambiar_contrasena_con_token(self, token: str, nueva_contrasena: str) -> dict:
        user_id = self._extraer_user_id_desde_token(token)

        token_guardado = self.cache.get(f"recuperar:{user_id}")
        if not token_guardado or token_guardado != token:
            raise HTTPException(
                status_code=400, detail="Token inválido o expirado"
            )

        usuario = self.usuario_repo.obtener_por_id(int(user_id))
        if not usuario:
            raise HTTPException(
                status_code=404, detail="Usuario no encontrado"
            )

        usuario.password = self.security.generar_hash(nueva_contrasena)
        self.usuario_repo.actualizar(usuario)

        self.cache.delete(f"recuperar:{user_id}")

        return {"message": "Contraseña actualizada correctamente"}

    def validar_token(self, token: str) -> dict:
        user_id = self._extraer_user_id_desde_token(token)

        token_guardado = self.cache.get(f"recuperar:{user_id}")
        if not token_guardado or token_guardado != token:
            raise HTTPException(
                status_code=400, detail="Token inválido o expirado"
            )

        return {"message": "Token válido"}

    def _extraer_user_id_desde_token(self, token: str) -> str:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=400, detail="Token inválido"
                )
            return user_id
        except ExpiredSignatureError:
            raise HTTPException(
                status_code=400, detail="Token expirado"
            )
        except JWTError:
            raise HTTPException(
                status_code=400, detail="Token inválido"
            )
