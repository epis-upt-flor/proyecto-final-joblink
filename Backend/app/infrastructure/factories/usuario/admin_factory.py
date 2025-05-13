from app.infrastructure.orm_models.administrador_orm import AdministradorORM
from app.infrastructure.schemas.auth_schema import AdminCreate
from app.domain.factories.creador_usuario import CreadorUsuario

class CreadorAdministrador(CreadorUsuario):
    def crear_usuario(self, schema: AdminCreate, hashed_password: str) -> AdministradorORM:
        return AdministradorORM(
            username=schema.username,
            email=schema.email,
            password=hashed_password,
            idRol=schema.idRol,
            nombres=schema.nombres,
            apellidos=schema.apellidos,
            telefono=schema.telefono,
            tipoDoc=schema.tipoDoc,
            numDoc=schema.numDoc,
            tipo="admin"
        )
