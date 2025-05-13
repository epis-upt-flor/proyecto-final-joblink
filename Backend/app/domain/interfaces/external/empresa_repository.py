from abc import ABC, abstractmethod
from typing import List, Dict, Optional

class EmpresaRepository(ABC):

    @abstractmethod
    def listar_empresas(self) -> List[Dict]:
        """Obtiene todas las empresas registradas."""
        pass

    @abstractmethod
    def obtener_empresa_por_id(self, empresa_id: int) -> Optional[Dict]:
        """Obtiene una empresa por su ID."""
        pass

    @abstractmethod
    def eliminar_empresa(self, empresa_id: int) -> bool:
        """Elimina una empresa."""
        pass

    @abstractmethod
    def editar_empresa(self, empresa_id: int, nombre: str, ruc: str, telefono: str, logo: str) -> Optional[Dict]:
        """Actualiza los detalles de una empresa."""
        pass
