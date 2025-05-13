from abc import ABC, abstractmethod
from typing import Dict


class TokenRepository(ABC):

    @abstractmethod
    def crear_token(self, payload: Dict) -> str:
        """Genera un token a partir de un payload."""
        pass

    @abstractmethod
    def verificar_token(self, token: str) -> Dict:
        """Verifica un token y devuelve el payload si es válido."""
        pass
