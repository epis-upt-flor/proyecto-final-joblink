from typing import List, Optional
from fastapi import HTTPException
from app.domain.models.postulacion import Postulacion
from app.domain.interfaces.external.postulacion_repository import PostulacionRepository
from app.domain.interfaces.internal.postulacion_usecase import PostulacionUseCase


class PostulacionService(PostulacionUseCase):
    def __init__(self, repository: PostulacionRepository):
        self.repository = repository

    def registrar_postulacion(self, postulacion: Postulacion) -> Postulacion:
        return self.repository.registrar_postulacion(postulacion)

    def obtener_todas(self) -> List[Postulacion]:
        return self.repository.obtener_postulaciones()

    def obtener_por_id(self, id: int) -> Optional[Postulacion]:
        postulacion = self.repository.obtener_postulacion_por_id(id)
        if not postulacion:
            raise HTTPException(
                status_code=404, detail="Postulación no encontrada")
        return postulacion

    def actualizar_postulacion(self, postulacion: Postulacion) -> Optional[Postulacion]:
        actualizado = self.repository.actualizar_postulacion(postulacion)
        if not actualizado:
            raise HTTPException(
                status_code=404, detail="Postulación no encontrada")
        return actualizado

    def eliminar_postulacion(self, id: int) -> bool:
        if not self.repository.eliminar_postulacion(id):
            raise HTTPException(
                status_code=404, detail="Postulación no encontrada")
        return True
