from abc import ABC, abstractmethod
from Backend.app.infrastructure.orm_models.usuario_orm import Usuario


class UsuarioObserver(ABC):
    @abstractmethod
    def notificar(self, usuario: Usuario, password: str):
        pass
