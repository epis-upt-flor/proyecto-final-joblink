from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models.egresado import Egresado


class EgresadoRepository(ABC):
    @abstractmethod
    def registrar_egresado(self, egresado: Egresado) -> Egresado:
        """Guarda un nuevo egresado y devuelve el objeto guardado."""
        pass

    @abstractmethod
    def obtener_egresados(self) -> List[Egresado]:
        """Devuelve una lista de todos los egresados."""
        pass

    @abstractmethod
    def obtener_egresado_por_id(self, id: int) -> Optional[Egresado]:
        """Devuelve un egresado por ID, o None si no existe."""
        pass

    @abstractmethod
    def actualizar_egresado(self, egresado: Egresado) -> Egresado:
        """Actualiza un egresado existente."""
        pass

    @abstractmethod
    def eliminar_egresado(self, id: int) -> bool:
        """Elimina un egresado por ID. Devuelve True si fue eliminado."""
        pass
