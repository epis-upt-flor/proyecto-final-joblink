from abc import ABC, abstractmethod


class RecuperacionRepository(ABC):

    @abstractmethod
    def enviar_correo_con_token(self, email: str, token: str) -> None:
        """Envía un token de recuperación por correo electrónico."""
        pass

    @abstractmethod
    def guardar_token(self, email: str, token: str) -> None:
        """Guarda el token de recuperación asociado al correo."""
        pass

    @abstractmethod
    def verificar_token(self, token: str) -> str:
        """Verifica si el token es válido y retorna el correo asociado."""
        pass

    @abstractmethod
    def cambiar_contrasena(self, email: str, nueva_contrasena: str) -> None:
        """Cambia la contraseña del usuario con el correo dado."""
        pass
