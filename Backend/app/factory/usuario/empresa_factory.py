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
