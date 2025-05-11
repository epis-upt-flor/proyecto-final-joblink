from abc import ABC, abstractmethod
from typing import Dict


class RecomendadorRepository(ABC):

    @abstractmethod
    def agregar_egresado_a_vector_db(self, egresado: dict) -> None:
        """Agrega un egresado al índice de vectores."""
        pass

    @abstractmethod
    def agregar_oferta_a_vector_db(self, oferta: dict) -> None:
        """Agrega una oferta de trabajo al índice de vectores."""
        pass

    @abstractmethod
    def recomendar(self, oferta_id: int) -> Dict:
        """Devuelve recomendaciones de egresados para una oferta de trabajo."""
        pass
