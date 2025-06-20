from typing import Optional
from .usuario import Usuario


class Administrador(Usuario):
    def __init__(
        self,
        id: Optional[int],
        username: str,
        password: str,
        email: str,
        nombres: str,
        apellidos: str,
        telefono: str,
        tipoDoc: str,
        numDoc: str
    ):
        super().__init__(id, username, password, email)
        self.nombres = nombres
        self.apellidos = apellidos
        self.telefono = telefono
        self.tipoDoc = tipoDoc
        self.numDoc = numDoc
