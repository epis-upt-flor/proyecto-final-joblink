from abc import ABC, abstractmethod
from typing import List, Optional
from domain.models.usuario import Usuario


class UsuarioRepository(ABC):

    @abstractmethod
    def obtener_usuario_por_token(self, token: str) -> Optional[Usuario]:
        """Obtiene un usuario a partir del token JWT."""
        pass

    @abstractmethod
    def listar_usuarios(self) -> List[Usuario]:
        """Devuelve todos los usuarios registrados en el sistema."""
        pass

    @abstractmethod
    def obtener_usuario_por_id(self, usuario_id: int) -> Optional[Usuario]:
        """Obtiene un usuario por su ID (opcional, para validaciones internas)."""
        pass

    @abstractmethod
    def obtener_usuario_por_email(self, email: str) -> Optional[Usuario]:
        """Obtiene un usuario por su correo (opcional, para autenticación o validación)."""
        pass
