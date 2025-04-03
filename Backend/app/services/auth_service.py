from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.usuario import Usuario
from app.models.empresa import Empresa
from app.models.administrador import Administrador
from app.utils.security import (
    verificar_token,
    generar_hash,
    verificar_password,
    crear_token
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def obtener_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    payload = verificar_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")

    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Token inválido")

    usuario = db.query(Usuario).filter(Usuario.username == username).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return usuario


def usuario_requiere_rol(roles_permitidos: list):
    def verificar_rol(usuario: Usuario = Depends(obtener_usuario_actual)):
        if usuario.rol not in roles_permitidos:
            raise HTTPException(
                status_code=403, detail=f"Acceso denegado para rol: {usuario.rol}")
        return usuario
    return verificar_rol


def registrar_usuario(data: dict, db: Session):
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    rol = data.get("rol")

    if not username or not password or not rol or not email:
        raise HTTPException(
            status_code=400, detail="Faltan campos obligatorios")

    if db.query(Usuario).filter(Usuario.username == username).first():
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    if db.query(Usuario).filter(Usuario.email == email).first():
        raise HTTPException(
            status_code=400, detail="El correo ya está registrado")

    hashed_password = generar_hash(password)

    if rol == "empresa":
        nuevo_usuario = Empresa(
            username=username,
            email=email,
            password=hashed_password,
            rol=rol,
            nombre=data.get("nombre"),
            ruc=data.get("ruc"),
            telefono=data.get("telefono"),
            logo=data.get("logo"),
        )
    elif rol == "admin":
        nuevo_usuario = Administrador(
            username=username,
            email=email,
            password=hashed_password,
            rol=rol,
            nombres=data.get("nombres"),
            apellidos=data.get("apellidos"),
            telefono=data.get("telefono"),
            tipoDoc=data.get("tipoDoc"),
            numDoc=data.get("numDoc"),
        )
    else:
        nuevo_usuario = Usuario(
            username=username,
            email=email,
            password=hashed_password,
            rol=rol
        )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    token = crear_token(
        {"sub": nuevo_usuario.username, "rol": nuevo_usuario.rol})

    return {
        "message": "Usuario registrado exitosamente",
        "access_token": token,
        "token_type": "bearer"
    }

def login_usuario(data: dict, db: Session):
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Faltan credenciales")

    usuario = db.query(Usuario).filter(Usuario.username == username).first()
    if not usuario or not verificar_password(password, usuario.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = crear_token({"sub": usuario.username, "role": usuario.rol})

    return {
        "access_token": token,
        "token_type": "bearer"
    }
