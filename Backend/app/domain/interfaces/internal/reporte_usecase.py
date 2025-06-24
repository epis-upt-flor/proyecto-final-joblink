from abc import ABC, abstractmethod
from typing import List, Dict

class ReporteUseCase(ABC):
    @abstractmethod
    def tasa_exito_egresados(self) -> List[Dict]:
        pass
