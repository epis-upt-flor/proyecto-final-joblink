from fastapi import HTTPException, Header, Depends
from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.services.token_service import TokenService
from app.models.database import get_db


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

    def listar_usuarios(self, db: Session):
        return db.query(Usuario).all()
