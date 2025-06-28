from abc import ABC, abstractmethod
from typing import Dict, Union
from app.domain.models.usuario import Usuario
from app.infrastructure.schemas.auth_schema import EmpresaCreate, AdminCreate, LoginRequest

class AuthUseCase(ABC):
    @abstractmethod
    def registrar_usuario(self, schema: Union[EmpresaCreate, AdminCreate]) -> Usuario:
        """Registra un nuevo usuario y devuelve el modelo de dominio"""
        pass

    @abstractmethod
    def login_usuario(self, login: LoginRequest) -> Dict[str, str]:
        """Autentica al usuario y retorna el token de acceso"""
        pass
