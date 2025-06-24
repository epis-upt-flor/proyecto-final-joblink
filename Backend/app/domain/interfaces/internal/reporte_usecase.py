from abc import ABC, abstractmethod
from typing import List, Dict

class ReporteUseCase(ABC):
    @abstractmethod
    def tasa_exito_egresados(self) -> List[Dict]:
        pass

    @abstractmethod
    def empresas_con_mas_contrataciones(self) -> List[Dict]:
        pass

    @abstractmethod
    def tendencias_contratacion_por_area(self) -> List[Dict]:
        pass
    
    @abstractmethod
    def perfil_egresados_contratados(self) -> Dict:
        pass
    
    @abstractmethod
    def ranking_egresados(self) -> List[Dict]:
        pass