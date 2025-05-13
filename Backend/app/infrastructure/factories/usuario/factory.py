from app.infrastructure.schemas.auth_schema import EmpresaCreate, AdminCreate
from app.infrastructure.factories.usuario.empresa_factory import CreadorEmpresa
from app.infrastructure.factories.usuario.admin_factory import CreadorAdministrador
from app.domain.factories.creador_usuario import CreadorUsuario

class UsuarioFactory:
    def get_creador(self, rol: str) -> CreadorUsuario:
        if rol == "empresa":
            return CreadorEmpresa()
        elif rol == "admin":
            return CreadorAdministrador()
        else:
            raise ValueError(f"Rol desconocido: {rol}")
