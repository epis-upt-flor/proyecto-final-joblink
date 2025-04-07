import uuid
from app.utils.redis_client import redis_conn
from app.utils.email import enviar_email_token
from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.utils.security import generar_hash
from uuid import uuid4
from app.factory.email_factory import EmailFactory

def generar_token_y_enviar(email: str, db: Session):
    usuario = db.query(Usuario).filter_by(email=email).first()
    if not usuario:
        raise Exception("Usuario no encontrado")

    token = str(uuid.uuid4()).split("-")[0]
    redis_conn.set(f"recuperar:{token}", usuario.id, ex=600)

    email_sender = EmailFactory.get("recuperacion")
    email_sender.send(to=email,token=token)

    return {"message": "Token enviado"}

def cambiar_contrasena_con_token(token: str, nueva_contrasena: str, db: Session):
    user_id = redis_conn.get(f"recuperar:{token}")
    if not user_id:
        raise Exception("Token inválido o expirado")

    usuario = db.query(Usuario).filter_by(id=user_id).first()
    if not usuario:
        raise Exception("Usuario no encontrado")

    usuario.password = generar_hash(nueva_contrasena)
    db.commit()
    redis_conn.delete(f"recuperar:{token}")
    return {"message": "Contraseña actualizada correctamente"}