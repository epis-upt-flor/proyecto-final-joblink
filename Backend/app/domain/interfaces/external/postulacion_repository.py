from abc import ABC, abstractmethod
from typing import List, Optional, Dict
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

    @abstractmethod
    def obtener_postulaciones_por_oferta(
        self, id_oferta: int) -> List[Postulacion]: ...

    @abstractmethod
    def obtener_postulaciones_por_empresa(
        self, id_empresa: int) -> List[Postulacion]: ...

    @abstractmethod
    def obtener_postulaciones_por_egresado(self) -> List[Dict]:
        pass