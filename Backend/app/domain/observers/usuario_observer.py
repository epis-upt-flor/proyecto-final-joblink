from abc import ABC, abstractmethod
from app.domain.models.usuario import Usuario


class UsuarioObserver(ABC):
    @abstractmethod
    def notificar(self, usuario: Usuario, password: str):
        pass
