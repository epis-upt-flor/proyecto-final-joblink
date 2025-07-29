from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models.oferta import Oferta


class OfertaRepository(ABC):
    @abstractmethod
    def guardar(self, oferta: Oferta) -> Oferta: ...

    @abstractmethod
    def obtener_todos(self) -> List[Oferta]: ...

    @abstractmethod
    def obtener_por_id(self, id: int) -> Optional[Oferta]: ...

    @abstractmethod
    def actualizar(self, id: int, data: dict) -> Optional[Oferta]: ...

    @abstractmethod
    def eliminar(self, id: int) -> bool: ...

    @abstractmethod
    def obtener_ofertas_por_empresa(self, id_empresa: int) -> List[Oferta]: ...