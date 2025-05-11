from abc import ABC, abstractmethod
from typing import Dict

class EgresadoUseCase(ABC):

    @abstractmethod
    def registrar_egresado(self, data: dict) -> Dict:
        """Registra un nuevo egresado."""
        pass

    @abstractmethod
    def obtener_egresados(self) -> list:
        """Obtiene todos los egresados."""
        pass

    @abstractmethod
    def obtener_egresado_por_id(self, id: int) -> Dict | None:
        """Obtiene un egresado por su ID."""
        pass

    @abstractmethod
    def actualizar_egresado(self, id: int, data: dict) -> Dict | None:
        """Actualiza un egresado existente."""
        pass

    @abstractmethod
    def eliminar_egresado(self, id: int) -> bool:
        """Elimina un egresado."""
        pass
