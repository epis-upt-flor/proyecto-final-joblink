from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models.egresado import Egresado

class EgresadoRepository(ABC):
    
    @abstractmethod
    def registrar_egresado(self, egresado: Egresado) -> Egresado:
        pass

    @abstractmethod
    def obtener_egresados(self) -> List[Egresado]:
        pass

    @abstractmethod
    def obtener_egresado_por_id(self, id: int) -> Optional[Egresado]:
        pass

    @abstractmethod
    def actualizar_egresado(self, egresado: Egresado) -> Optional[Egresado]:
        pass

    @abstractmethod
    def eliminar_egresado(self, id: int) -> bool:
        pass
