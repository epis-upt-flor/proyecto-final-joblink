from app.infrastructure.orm_models.empresa_orm import EmpresaORM
from app.infrastructure.schemas.auth_schema import EmpresaCreate
from app.domain.factories.creador_usuario import CreadorUsuario

class CreadorEmpresa(CreadorUsuario):
    def crear_usuario(self, schema: EmpresaCreate, hashed_password: str) -> EmpresaORM:
        return EmpresaORM(
            username=schema.username,
            email=schema.email,
            password=hashed_password,
            idRol=schema.idRol,
            nombre=schema.nombre,
            ruc=schema.ruc,
            telefono=schema.telefono,
            logo=schema.logo,
            estado=True,
            tipo="empresa"
        )
