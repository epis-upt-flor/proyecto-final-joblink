from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from fastapi import HTTPException
from app.utils.security import generar_hash


def listar_usuarios(db: Session):
    return db.query(Usuario).all()


def registrar_usuario(db: Session, email: str, password: str, rol: str, username: str):
    usuario_existente = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese correo electrónico.")
    
    usuario_existente = db.query(Usuario).filter(Usuario.username == username).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese nombre de usuario.")
    
    hashed_password = generar_hash(password)
    
    usuario = Usuario(
        email=email,
        password=hashed_password,
        rol=rol,
        username=username
    )
    
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


