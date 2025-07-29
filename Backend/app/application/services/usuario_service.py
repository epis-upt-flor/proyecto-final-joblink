from fastapi import HTTPException, Header, Depends
from sqlalchemy.orm import Session
from app.infrastructure.orm_models.usuario_orm import UsuarioORM
from app.infrastructure.security.security import Security
from app.infrastructure.database.db_session_provider import DBSessionProvider


class UserService:
    def __init__(self):
        self.db_provider = DBSessionProvider()
        self.security = Security()

    def obtener_usuario_actual(self, token: str, db: Session) -> UsuarioORM:
        """
        Devuelve el usuario actual autenticado a partir del token JWT.
        """
        payload = self.security.verificar_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Token inválido")

        user_id = payload.get("id")
        id_rol = payload.get("role")

        if not user_id or not id_rol:
            raise HTTPException(status_code=401, detail="Token inválido (sin id o role)")

        usuario = db.query(UsuarioORM).filter(UsuarioORM.id == user_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        if int(usuario.idRol) != int(id_rol):
            raise HTTPException(status_code=403, detail="Rol en token no coincide con el de la base")

        return usuario

    def usuario_requiere_rol(self, roles_permitidos: list[int]):
        """
        Dependencia para inyectar en rutas que requieren un rol específico.
        """
        def verificar_rol(
            authorization: str = Header(...),
            db: Session = Depends(self.db_provider.get_session)
        ) -> UsuarioORM:
            token = authorization.replace("Bearer ", "").strip()
            usuario = self.obtener_usuario_actual(token, db)

            if usuario.idRol not in roles_permitidos:
                raise HTTPException(
                    status_code=403,
                    detail=f"Acceso denegado para rol: {usuario.idRol}"
                )
            return usuario

        return verificar_rol

    def listar_usuarios(self, db: Session) -> list[UsuarioORM]:
        """
        Lista todos los usuarios en la base de datos.
        """
        return db.query(UsuarioORM).all()