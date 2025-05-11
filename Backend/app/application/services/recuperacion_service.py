from uuid import uuid4
from sqlalchemy.orm import Session
from Backend.app.infrastructure.orm_models.usuario_orm import Usuario
from app.infrastructure.database.redis_client import RedisClient
from app.infrastructure.security.security import Security
from app.infrastructure.factories.email_factory import EmailFactory


class RecuperacionService:
    def __init__(self):
        self.redis = RedisClient().get_connection()

    def generar_token_y_enviar(self, email: str, db: Session):
        usuario = db.query(Usuario).filter_by(email=email).first()
        if not usuario:
            raise Exception("Usuario no encontrado")

        token = str(uuid4()).split("-")[0]
        self.redis.set(f"recuperar:{token}", usuario.id, ex=600)

        email_sender = EmailFactory.get("recuperacion")
        email_sender.send(to=email, token=token)

        return {"message": "Token enviado"}

    def cambiar_contrasena_con_token(self, token: str, nueva_contrasena: str, db: Session):
        user_id = self.redis.get(f"recuperar:{token}")
        if not user_id:
            raise Exception("Token inválido o expirado")

        usuario = db.query(Usuario).filter_by(id=user_id).first()
        if not usuario:
            raise Exception("Usuario no encontrado")

        usuario.password = Security.generar_hash(nueva_contrasena)
        db.commit()
        self.redis.delete(f"recuperar:{token}")

        return {"message": "Contraseña actualizada correctamente"}
