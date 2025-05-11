from abc import ABC, abstractmethod
from typing import Dict, Any
from domain.models.usuario import Usuario


class AuthUseCase(ABC):
    
    @abstractmethod
    def registrar_usuario(self, data: Dict[str, Any]) -> Usuario:
        """Registra un nuevo usuario y devuelve la entidad Usuario."""
        pass

    @abstractmethod
    def login_usuario(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Autentica al usuario y retorna un token JWT u otra info relevante."""
        pass
