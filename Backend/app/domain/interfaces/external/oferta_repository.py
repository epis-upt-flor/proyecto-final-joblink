from abc import ABC, abstractmethod
from typing import Dict, List, Optional


class OfertaRepository(ABC):

    @abstractmethod
    def registrar_oferta(self, data: dict) -> Dict:
        """Registra una nueva oferta en la base de datos."""
        pass

    @abstractmethod
    def listar_ofertas(self) -> List[Dict]:
        """Devuelve todas las ofertas registradas."""
        pass

    @abstractmethod
    def obtener_oferta_por_id(self, id: int) -> Optional[Dict]:
        """Devuelve una oferta según su ID."""
        pass

    @abstractmethod
    def actualizar_oferta(self, id: int, data: dict) -> Optional[Dict]:
        """Actualiza y devuelve la oferta actualizada."""
        pass

    @abstractmethod
    def eliminar_oferta(self, id: int) -> bool:
        """Elimina una oferta según su ID."""
        pass
