from datetime import date
from typing import List, Optional
from fastapi import HTTPException
from app.domain.interfaces.internal.contrato_usecase import ContratoUseCase
from app.domain.models.contrato import Contrato
from app.domain.models.enum import EstadoPostulacion
from app.domain.models.postulacion import Postulacion
from app.domain.interfaces.external.postulacion_repository import PostulacionRepository
from app.domain.interfaces.internal.postulacion_usecase import PostulacionUseCase


class PostulacionService(PostulacionUseCase):
    def __init__(self, repository: PostulacionRepository, contrato_service: ContratoUseCase):
        self.repository = repository
        self.contrato_service = contrato_service

    def registrar_postulacion(self, postulacion: Postulacion) -> Postulacion:
        existentes = self.repository.obtener_postulaciones_por_oferta(
            postulacion.idOferta)
        ya_existe = any(
            p["idEgresado"] == postulacion.idEgresado for p in existentes)

        if ya_existe:
            raise HTTPException(
                status_code=400,
                detail="Ya existe una postulación para esta oferta por este egresado."
            )

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

    def aprobar_postulacion(self, id: int) -> Postulacion:
        postulacion = self.obtener_por_id(id)
        postulacion.estado = EstadoPostulacion.APROBADA
        actualizada = self.actualizar_postulacion(postulacion)

        contrato = Contrato(
            id=None,
            idOfertaEgresado=id,
            fechaFin=date.today().replace(year=date.today().year + 1),
            estado="VIGENTE"
        )
        self.contrato_service.registrar_contrato(contrato)

        return actualizada

    def rechazar_postulacion(self, id: int) -> Postulacion:
        postulacion = self.obtener_por_id(id)
        postulacion.estado = EstadoPostulacion.RECHAZADA
        return self.actualizar_postulacion(postulacion)

    def obtener_por_oferta(self, id_oferta: int) -> List[Postulacion]:
        return self.repository.obtener_postulaciones_por_oferta(id_oferta)

    def obtener_por_empresa(self, id_empresa: int) -> List[Postulacion]:
        return self.repository.obtener_postulaciones_por_empresa(id_empresa)
