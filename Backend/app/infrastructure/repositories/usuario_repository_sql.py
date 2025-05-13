# app/infrastructure/repositories/usuario_repository_sql.py
from fastapi import HTTPException
from app.domain.interfaces.external.usuario_repository import IUsuarioRepository
from app.domain.models.usuario import Usuario as UsuarioDomain
from app.infrastructure.orm_models.usuario_orm import UsuarioORM
from app.infrastructure.orm_models.rol_orm import RolORM
from sqlalchemy.orm import Session


class UsuarioRepositorySQL(IUsuarioRepository):
    def __init__(self, db: Session):
        self.db = db

    def obtener_por_username(self, username: str) -> UsuarioDomain | None:
        orm = self.db.query(UsuarioORM).filter(
            UsuarioORM.username == username).first()
        return self._to_domain(orm) if orm else None

    def obtener_por_email(self, email: str) -> UsuarioDomain | None:
        orm = self.db.query(UsuarioORM).filter(
            UsuarioORM.email == email).first()
        return self._to_domain(orm) if orm else None

    def guardar(self, usuario: UsuarioORM) -> UsuarioDomain:
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return self._to_domain(usuario)

    def obtener_nombre_rol_por_id(self, id_rol: int) -> str:
        rol = self.db.query(RolORM).filter(RolORM.id == id_rol).first()
        if not rol:
            raise HTTPException(status_code=404, detail="Rol no encontrado")
        return rol.nombre

    def _to_domain(self, orm: UsuarioORM) -> UsuarioDomain:
        return UsuarioDomain(
            id=orm.id,
            username=orm.username,
            email=orm.email,
            password=orm.password,
            idRol=orm.idRol
        )
