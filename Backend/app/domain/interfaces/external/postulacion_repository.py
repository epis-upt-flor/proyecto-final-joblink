from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models.postulacion import Postulacion


class PostulacionRepository(ABC):
    @abstractmethod
    def registrar_postulacion(
        self, postulacion: Postulacion) -> Postulacion: ...

    @abstractmethod
    def obtener_postulaciones(self) -> List[Postulacion]: ...

    @abstractmethod
    def obtener_postulacion_por_id(self, id: int) -> Optional[Postulacion]: ...

    @abstractmethod
    def actualizar_postulacion(
        self, postulacion: Postulacion) -> Optional[Postulacion]: ...

    @abstractmethod
    def eliminar_postulacion(self, id: int) -> bool: ...
