from abc import ABC, abstractmethod
from typing import Optional
from datetime import timedelta

class ISecurity(ABC):
    @abstractmethod
    def generar_hash(self, password: str) -> str:
        ...

    @abstractmethod
    def verificar_password(self, plain_password: str, hashed_password: str) -> bool:
        ...

    @abstractmethod
    def crear_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        ...

    @abstractmethod
    def verificar_token(self, token: str) -> Optional[dict]:
        ...
