from abc import ABC, abstractmethod
from typing import Dict

class ContratacionUseCase(ABC):

    @abstractmethod
    def registrar_contratacion(self, data: dict) -> Dict:
        """Registra una nueva contratación."""
        pass
