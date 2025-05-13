from .usuario import Usuario
from typing import Optional


class Empresa(Usuario):
    def __init__(
        self,
        id: Optional[int],
        username: str,
        password: str,
        email: str,
        nombre: str,
        ruc: str,
        telefono: str,
        logo: Optional[str] = None,
        estado: bool = True
    ):
        super().__init__(id, username, password, email)
        self.nombre = nombre
        self.ruc = ruc
        self.telefono = telefono
        self.logo = logo
        self.estado = estado
