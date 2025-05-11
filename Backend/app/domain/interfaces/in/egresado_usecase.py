from abc import ABC, abstractmethod
from app.domain.models.egresado import Egresado

class EgresadoUseCase(ABC):

    @abstractmethod
    def registrar_egresado(self, data: dict) -> Egresado:
        pass

    @abstractmethod
    def obtener_egresados(self) -> list:
        pass

    @abstractmethod
    def obtener_egresado_por_id(self, id: int) -> Egresado | None:
        pass

    @abstractmethod
    def actualizar_egresado(self, id: int, data: dict) -> Egresado | None:
        pass

    @abstractmethod
    def eliminar_egresado(self, id: int) -> bool:
        pass
