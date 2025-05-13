from abc import ABC, abstractmethod
from typing import Dict

class OfertaUseCase(ABC):

    @abstractmethod
    def registrar_oferta(self, data: dict) -> Dict:
        """Registra una nueva oferta de trabajo."""
        pass

    @abstractmethod
    def listar_ofertas(self) -> list:
        """Lista todas las ofertas de trabajo."""
        pass

    @abstractmethod
    def obtener_oferta_por_id(self, id: int) -> Dict | None:
        """Obtiene una oferta de trabajo por su ID."""
        pass

    @abstractmethod
    def actualizar_oferta(self, id: int, data: dict) -> Dict | None:
        """Actualiza una oferta de trabajo existente."""
        pass

    @abstractmethod
    def eliminar_oferta(self, id: int) -> bool:
        """Elimina una oferta de trabajo."""
        pass
