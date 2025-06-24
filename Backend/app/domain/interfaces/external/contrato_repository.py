from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from app.domain.models.contrato import Contrato

class ContratoRepository(ABC):
    @abstractmethod
    def registrar_contrato(self, contrato: Contrato) -> Contrato: ...

    @abstractmethod
    def obtener_contratos(self) -> List[Contrato]: ...

    @abstractmethod
    def obtener_contrato_por_id(self, id: int) -> Optional[Contrato]: ...

    @abstractmethod
    def actualizar_contrato(self, contrato: Contrato) -> Optional[Contrato]: ...

    @abstractmethod
    def eliminar_contrato(self, id: int) -> bool: ...

    @abstractmethod
    def obtener_contratos_por_egresado(self) -> List[Dict]:
        pass