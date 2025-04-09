from app.models.usuario import Usuario
from app.models.empresa import Empresa
from app.models.administrador import Administrador
from app.utils.security import generar_hash

# Creador Base
class CreadorUsuario:
    def crear_usuario(self, data, hashed_password):
        raise NotImplementedError

# Creador para Empresa
class CreadorEmpresa(CreadorUsuario):
    def crear_usuario(self, data, hashed_password):
        return Empresa(
            username=data["username"],
            email=data["email"],
            password=hashed_password,
            rol=data["rol"],
            nombre=data["nombre"],
            ruc=data["ruc"],
            telefono=data["telefono"],
            logo=data["logo"]
        )
    def post_creacion(self, usuario, password):
        from app.factory.email_factory import EmailFactory
        sender = EmailFactory.get("bienvenida")
        sender.send(
            to=usuario.email,
            password=password,
            nombre_empresa=usuario.nombre
        )

# Creador para Administrador
class CreadorAdministrador(CreadorUsuario):
    def crear_usuario(self, data, hashed_password):
        return Administrador(
            username=data["username"],
            email=data["email"],
            password=hashed_password,
            rol=data["rol"],
            nombres=data["nombres"],
            apellidos=data["apellidos"],
            telefono=data["telefono"],
            tipoDoc=data["tipoDoc"],
            numDoc=data["numDoc"]
        )

# Factory que selecciona el creador adecuado
class UsuarioFactory:
    def get_creador(self, rol):
        if rol == "empresa":
            return CreadorEmpresa()
        elif rol == "admin":
            return CreadorAdministrador()
        else:
            raise ValueError(f"Rol desconocido al intentar registrar usuario: {rol}")
