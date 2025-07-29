from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models.postulacion import Postulacion


class PostulacionUseCase(ABC):
    @abstractmethod
    def registrar_postulacion(
        self, postulacion: Postulacion) -> Postulacion: ...

    @abstractmethod
    def obtener_todas(self) -> List[Postulacion]: ...

    @abstractmethod
    def obtener_por_id(self, id: int) -> Optional[Postulacion]: ...

    @abstractmethod
    def actualizar_postulacion(
        self, postulacion: Postulacion) -> Optional[Postulacion]: ...

    @abstractmethod
    def eliminar_postulacion(self, id: int) -> bool: ...

    @abstractmethod
    def aprobar_postulacion(self, id: int) -> Postulacion: ...

    @abstractmethod
    def rechazar_postulacion(self, id: int) -> Postulacion: ...

    @abstractmethod
    def obtener_por_oferta(self, id_oferta: int) -> List[Postulacion]: ...

    @abstractmethod
    def obtener_por_empresa(self, id_empresa: int) -> List[Postulacion]: ...
