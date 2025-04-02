from sqlalchemy.orm import Session
from app.models.usuario import Usuario

def crear_usuario(db: Session, data: dict) -> Usuario:
    usuario = Usuario(
        username=data["username"],
        password=data["password"],
        rol=data["rol"],
    )
    
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

def listar_usuarios(db: Session):
    return db.query(Usuario).all()
