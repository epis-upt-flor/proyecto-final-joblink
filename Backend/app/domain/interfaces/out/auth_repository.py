from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from domain.models.usuario import Usuario


class AuthRepository(ABC):

    @abstractmethod
    def crear_usuario(self, data: Dict[str, Any]) -> Usuario:
        """Crea un nuevo usuario en la base de datos."""
        pass

    @abstractmethod
    def obtener_usuario_por_username(self, username: str) -> Optional[Usuario]:
        """Obtiene un usuario por su nombre de usuario (o identificador único)."""
        pass
