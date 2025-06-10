from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models.egresado import Egresado


class EgresadoUseCase(ABC):
    @abstractmethod
    def registrar_egresado(self, egresado: Egresado) -> Egresado: ...

    @abstractmethod
    def obtener_todos(self) -> List[Egresado]: ...

    @abstractmethod
    def obtener_por_id(self, id: int) -> Optional[Egresado]: ...

    @abstractmethod
    def actualizar_egresado(
        self, egresado: Egresado) -> Optional[Egresado]: ...

    @abstractmethod
    def eliminar_egresado(self, id: int) -> bool: ...
