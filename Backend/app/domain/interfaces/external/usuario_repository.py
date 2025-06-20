from abc import ABC, abstractmethod
from typing import Optional
from app.domain.models.usuario import Usuario


class IUsuarioRepository(ABC):
    @abstractmethod
    def obtener_por_username(self, username: str) -> Optional[Usuario]: ...

    @abstractmethod
    def obtener_por_email(self, email: str) -> Optional[Usuario]: ...

    @abstractmethod
    def guardar(self, usuario: Usuario) -> Usuario: ...
    @abstractmethod
    def obtener_por_id(self, id: int) -> Optional[Usuario]: ...
    @abstractmethod
    def actualizar(self, usuario: Usuario) -> Usuario: ...
