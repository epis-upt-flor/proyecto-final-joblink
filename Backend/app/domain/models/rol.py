from typing import Optional


class Rol:
    def __init__(self, id: Optional[int], nombre: str, estado: bool = True):
        self.id = id
        self.nombre = nombre
        self.estado = estado
