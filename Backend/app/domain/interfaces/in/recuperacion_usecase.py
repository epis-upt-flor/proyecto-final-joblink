from abc import ABC, abstractmethod

class RecuperacionUseCase(ABC):

    @abstractmethod
    def generar_token_y_enviar(self, email: str) -> dict:
        """Genera un token y lo envía por correo electrónico."""
        pass

    @abstractmethod
    def cambiar_contrasena_con_token(self, token: str, nueva_contrasena: str) -> dict:
        """Cambia la contraseña del usuario usando un token de recuperación."""
        pass
