from fastapi import HTTPException, Depends, Header
from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.factory.usuario.factory import UsuarioFactory
from app.utils.security import Security
from app.models.database import get_db


class TokenService:
    @staticmethod
    def verificar_token(token: str) -> dict:
        payload = Security.verificar_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Token inválido")
        return payload

    @staticmethod
    def crear_token(username: str, rol: str) -> str:
        return Security.crear_token({"sub": username, "role": rol})


class UserService:
    def obtener_usuario_actual(self, token: str, db: Session) -> Usuario:
        payload = TokenService.verificar_token(token)
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Token inválido")

        usuario = db.query(Usuario).filter(Usuario.username == username).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return usuario

    def usuario_requiere_rol(self, roles_permitidos: list):
        async def verificar_rol(
            authorization: str = Header(...),
            db: Session = Depends(get_db)
        ):
            token = authorization.replace("Bearer ", "")
            usuario = self.obtener_usuario_actual(token, db)
            if usuario.rol not in roles_permitidos:
                raise HTTPException(
                    status_code=403, detail=f"Acceso denegado para rol: {usuario.rol}")
            return usuario
        return verificar_rol


class AuthService:
    def registrar_usuario(self, data: dict, db: Session) -> Usuario:
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        rol = data.get("rol")

        if not username or not password or not rol or not email:
            raise HTTPException(status_code=400, detail="Faltan campos obligatorios")

        if db.query(Usuario).filter(Usuario.username == username).first():
            raise HTTPException(status_code=400, detail="El usuario ya existe")

        if db.query(Usuario).filter(Usuario.email == email).first():
            raise HTTPException(status_code=400, detail="El correo ya está registrado")

        hashed_password = Security.generar_hash(password)

        factory = UsuarioFactory()
        creador = factory.get_creador(rol)
        nuevo_usuario = creador.crear_usuario(data, hashed_password)

        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)

        if hasattr(creador, "post_creacion"):
            try:
                creador.post_creacion(nuevo_usuario, password)
            except Exception as e:
                print(f"⚠️ Error post_creación: {e}")

        return nuevo_usuario

    def login_usuario(self, data: dict, db: Session):
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            raise HTTPException(status_code=400, detail="Faltan credenciales")

        usuario = db.query(Usuario).filter(Usuario.username == username).first()
        if not usuario or not Security.verificar_password(password, usuario.password):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        token = TokenService.crear_token(usuario.username, usuario.rol)

        return {
            "access_token": token,
            "token_type": "bearer",
        }
