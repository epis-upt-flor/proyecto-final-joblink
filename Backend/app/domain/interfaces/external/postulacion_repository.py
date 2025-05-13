from abc import ABC, abstractmethod
from typing import Dict


class PostulacionRepository(ABC):

    @abstractmethod
    def crear_postulacion(self, oferta_id: int, egresado_id: int, posicion: int) -> Dict:
        """Registra una nueva postulación en la base de datos."""
        pass
