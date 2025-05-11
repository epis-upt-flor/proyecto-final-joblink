from app.infrastructure.factories.usuario.empresa_factory import CreadorEmpresa
from app.infrastructure.factories.usuario.admin_factory import CreadorAdministrador

class UsuarioFactory:
    def get_creador(self, rol):
        if rol == "empresa":
            return CreadorEmpresa()
        elif rol == "admin":
            return CreadorAdministrador()
        else:
            raise ValueError(f"Rol desconocido al intentar registrar usuario: {rol}")
