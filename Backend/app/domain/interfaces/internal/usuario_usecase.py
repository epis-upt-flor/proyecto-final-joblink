from abc import ABC, abstractmethod
from typing import Any, List
from domain.models.usuario import Usuario


class UsuarioUseCase(ABC):

    @abstractmethod
    def obtener_usuario_actual(self, token: str) -> Usuario:
        """Devuelve el usuario autenticado a partir del token JWT."""
        pass

    @abstractmethod
    def usuario_requiere_rol(self, roles_permitidos: List[str]) -> Any:
        """Verifica que el usuario tenga un rol permitido para acceder a cierto recurso."""
        pass

    @abstractmethod
    def listar_usuarios(self) -> List[Usuario]:
        """Devuelve todos los usuarios registrados."""
        pass
