from typing import List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.domain.models.usuario import Usuario
from app.infrastructure.factories.usuario.factory import UsuarioFactory
from app.application.services.token_service import TokenService
from app.infrastructure.security.security import Security
from app.infrastructure.observers.usuario_observer import UsuarioObserver


class AuthService:
    def __init__(self):
        self.observers: List[UsuarioObserver] = []

    def agregar_observer(self, observer: UsuarioObserver):
        self.observers.append(observer)

    def notificar_observers(self, usuario: Usuario, password: str):
        for observer in self.observers:
            try:
                observer.notificar(usuario, password)
            except Exception as e:
                print(
                    f"⚠️ Error notificando observer {observer.__class__.__name__}: {e}")

    def registrar_usuario(self, data: dict, db: Session) -> Usuario:
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

        hashed_password = Security.generar_hash(password)

        factory = UsuarioFactory()
        creador = factory.get_creador(rol)
        nuevo_usuario = creador.crear_usuario(data, hashed_password)

        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)

        self.notificar_observers(nuevo_usuario, password)

        return nuevo_usuario

    def login_usuario(self, data: dict, db: Session):
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            raise HTTPException(status_code=400, detail="Faltan credenciales")

        usuario = db.query(Usuario).filter(
            Usuario.username == username).first()
        if not usuario or not Security.verificar_password(password, usuario.password):
            raise HTTPException(
                status_code=401, detail="Credenciales inválidas")

        token = TokenService.crear_token(
            {"sub": usuario.username, "role": usuario.rol})

        return {
            "access_token": token,
            "token_type": "bearer",
        }
