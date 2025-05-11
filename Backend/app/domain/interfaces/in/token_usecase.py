from abc import ABC, abstractmethod

class TokenUseCase(ABC):

    @abstractmethod
    def verificar_token(self, token: str) -> dict:
        """Verifica la validez de un token y devuelve el payload si es válido."""
        pass

    @abstractmethod
    def crear_token(self, payload: dict) -> str:
        """Crea un token a partir de un payload."""
        pass
