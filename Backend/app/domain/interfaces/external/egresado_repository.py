from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from app.domain.models.egresado import Egresado


class EgresadoRepository(ABC):
    @abstractmethod
    def registrar_egresado(self, egresado: Egresado) -> Egresado: ...

    @abstractmethod
    def obtener_egresados(self) -> List[Egresado]: ...

    @abstractmethod
    def obtener_egresado_por_id(self, id: int) -> Optional[Egresado]: ...

    @abstractmethod
    def actualizar_egresado(self, egresado: Egresado) -> Egresado: ...

    @abstractmethod
    def eliminar_egresado(self, id: int) -> bool: ...

    @abstractmethod
    def obtener_nombres_por_ids(self, ids: List[int]) -> List[Dict]:
        pass