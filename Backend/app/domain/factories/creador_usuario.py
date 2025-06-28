from abc import ABC, abstractmethod
from app.domain.models.usuario import Usuario

class CreadorUsuario(ABC):
    @abstractmethod
    def crear_usuario(self, schema, hashed_password: str) -> Usuario:
        ...
