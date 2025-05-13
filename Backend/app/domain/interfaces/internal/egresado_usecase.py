from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models.egresado import Egresado


class EgresadoUseCase(ABC):
    @abstractmethod
    def registrar_egresado(self, egresado: Egresado) -> Egresado:
        """Registra un nuevo egresado."""
        pass

    @abstractmethod
    def obtener_egresados(self) -> List[Egresado]:
        """Devuelve una lista de todos los egresados."""
        pass

    @abstractmethod
    def obtener_egresado_por_id(self, id: int) -> Optional[Egresado]:
        """Devuelve un egresado por su ID, si existe."""
        pass

    @abstractmethod
    def actualizar_egresado(self, id: int, nuevos_datos: dict) -> Egresado:
        """Actualiza los datos de un egresado existente."""
        pass

    @abstractmethod
    def eliminar_egresado(self, id: int) -> bool:
        """Elimina un egresado por ID."""
        pass
