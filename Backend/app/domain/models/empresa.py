from typing import Optional

class Empresa:
    def __init__(self, id: int, nombre: str, ruc: str, telefono: str, logo: Optional[str], estado: bool):
        self.id = id
        self.nombre = nombre
        self.ruc = ruc
        self.telefono = telefono
        self.logo = logo
        self.estado = estado
