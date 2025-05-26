from abc import ABC, abstractmethod
from typing import Any, List


class VectorDBRepository(ABC):
    @abstractmethod
    def agregar_egresado(self, egresado: Any, vector: List[float]): ...

    @abstractmethod
    def agregar_oferta(self, oferta: Any, vector: List[float]): ...

    @abstractmethod
    def buscar_similares(
        self, vector: List[float], top_k: int) -> List[dict]: ...
