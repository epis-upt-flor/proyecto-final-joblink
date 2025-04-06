from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from fastapi import HTTPException
from app.utils.security import generar_hash


def listar_usuarios(db: Session):
    return db.query(Usuario).all()


