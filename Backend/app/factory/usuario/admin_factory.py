from app.models.administrador import Administrador
from app.factory.usuario.base import CreadorUsuario

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
