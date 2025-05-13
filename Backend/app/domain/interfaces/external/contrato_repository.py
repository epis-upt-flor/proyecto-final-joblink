from abc import ABC, abstractmethod
from typing import Dict


class ContratoRepository(ABC):

    @abstractmethod
    def registrar_contratacion(self, data: dict) -> Dict:
        """Registra una nueva contratación en la base de datos y retorna sus datos."""
        pass
