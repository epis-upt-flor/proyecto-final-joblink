from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models.empresa import Empresa

class IEmpresaRepository(ABC):
    @abstractmethod
    def obtener_todas(self) -> List[Empresa]: ...
    
    @abstractmethod
    def obtener_por_id(self, id: int) -> Optional[Empresa]: ...

    @abstractmethod
    def editar(self, empresa: Empresa) -> Optional[Empresa]: ...
