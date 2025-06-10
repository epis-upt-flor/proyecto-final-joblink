from abc import ABC, abstractmethod
from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.models.empresa import Empresa

class IEmpresaRepository(ABC):
    @abstractmethod
    def obtener_todas(self, db: Session) -> List[Empresa]: ...
    
    @abstractmethod
    def obtener_por_id(self, db: Session, id: int) -> Optional[Empresa]: ...

