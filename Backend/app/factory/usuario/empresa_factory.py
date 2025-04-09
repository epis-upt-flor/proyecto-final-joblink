from app.models.empresa import Empresa
from app.factory.usuario.base import CreadorUsuario

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
