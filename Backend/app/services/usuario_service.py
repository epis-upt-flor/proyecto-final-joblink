from sqlalchemy.orm import Session
from app.models.usuario import Usuario

def listar_usuarios(db: Session):
    return db.query(Usuario).all()
