from abc import ABC, abstractmethod
from typing import Dict

class PostulacionUseCase(ABC):

    @abstractmethod
    def crear_postulacion(self, oferta_id: int, egresado_id: int, posicion: int) -> Dict:
        """Crea una postulación para un egresado en una oferta específica."""
        pass
