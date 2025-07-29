from typing import List, Dict, Union
from fastapi import HTTPException
from app.domain.interfaces.internal.auth_usecase import AuthUseCase
from app.domain.interfaces.external.usuario_repository import IUsuarioRepository
from app.domain.models.usuario import Usuario
from app.infrastructure.factories.usuario.factory import UsuarioFactory
from app.domain.interfaces.external.security import ISecurity
from app.domain.observers.usuario_observer import UsuarioObserver
from app.infrastructure.schemas.auth_schema import LoginRequest
from app.infrastructure.schemas.auth_schema import EmpresaCreate, AdminCreate


class AuthService(AuthUseCase):
    def __init__(self, usuario_repo: IUsuarioRepository, security: ISecurity):
        self.usuario_repo = usuario_repo
        self.observers: List[UsuarioObserver] = []
        self.security = security

    def agregar_observer(self, observer: UsuarioObserver):
        self.observers.append(observer)

    def notificar_observers(self, usuario: Usuario, password: str):
        for observer in self.observers:
            try:
                observer.notificar(usuario, password)
            except Exception as e:
                print(
                    f"⚠️ Error notificando observer {observer.__class__.__name__}: {e}")

    def registrar_usuario(self, schema: Union[EmpresaCreate, AdminCreate]) -> Usuario:
        if self.usuario_repo.obtener_por_username(schema.username):
            raise HTTPException(status_code=400, detail="El usuario ya existe")

        if self.usuario_repo.obtener_por_email(schema.email):
            raise HTTPException(
                status_code=400, detail="El correo ya está registrado")

        hashed_password = self.security.generar_hash(schema.password)
        rol = self.usuario_repo.obtener_nombre_rol_por_id(schema.idRol)
        factory = UsuarioFactory()
        creador = factory.get_creador(rol)
        nuevo_usuario = creador.crear_usuario(schema, hashed_password)
        usuario_guardado = self.usuario_repo.guardar(nuevo_usuario)
        self.notificar_observers(usuario_guardado, schema.password)

        return usuario_guardado

    def login_usuario(self, login: LoginRequest) -> Dict[str, str]:
        if not login.username or not login.password:
            raise HTTPException(status_code=400, detail="Faltan credenciales")

        usuario = self.usuario_repo.obtener_por_username(login.username)
        if not usuario or not self.security.verificar_password(login.password, usuario.password):
            raise HTTPException(
                status_code=401, detail="Credenciales inválidas")

        token = self.security.crear_token(
            {"sub": usuario.username, "role": str(usuario.idRol), "id": usuario.id}
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }
