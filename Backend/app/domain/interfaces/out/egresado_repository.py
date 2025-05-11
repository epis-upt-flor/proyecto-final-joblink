from abc import ABC, abstractmethod
from typing import Dict, List, Optional


class EgresadoRepository(ABC):

    @abstractmethod
    def registrar_egresado(self, data: dict) -> Dict:
        """Registra un nuevo egresado en la base de datos."""
        pass

    @abstractmethod
    def obtener_egresados(self) -> List[Dict]:
        """Devuelve todos los egresados."""
        pass

    @abstractmethod
    def obtener_egresado_por_id(self, id: int) -> Optional[Dict]:
        """Devuelve un egresado según su ID."""
        pass

    @abstractmethod
    def actualizar_egresado(self, id: int, data: dict) -> Optional[Dict]:
        """Actualiza un egresado y devuelve el nuevo estado."""
        pass

    @abstractmethod
    def eliminar_egresado(self, id: int) -> bool:
        """Elimina un egresado por ID."""
        pass
