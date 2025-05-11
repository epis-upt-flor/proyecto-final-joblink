from abc import ABC, abstractmethod
from typing import Dict


class EmpresaUseCase(ABC):

    @abstractmethod
    def listar_empresas(self) -> list:
        """Obtiene todas las empresas registradas."""
        pass

    @abstractmethod
    def eliminar_empresa(self, empresa_id: int) -> Dict:
        """Elimina una empresa y su usuario asociado."""
        pass

    @abstractmethod
    def editar_empresa(self, empresa_id: int, nombre: str, ruc: str, telefono: str, logo: str) -> Dict:
        """Actualiza la información de una empresa."""
        pass
