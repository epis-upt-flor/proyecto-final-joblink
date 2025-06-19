from typing import List, Optional
from fastapi import HTTPException
from app.domain.models.oferta import Oferta
from app.domain.interfaces.internal.oferta_usecase import OfertaUseCase
from app.domain.interfaces.external.oferta_repository import OfertaRepository
from app.domain.interfaces.external.vector_db_repository import VectorDBRepository
from app.domain.interfaces.external.iembeddings import IEmbeddings
from app.domain.models.enum import EstadoOferta, EstadoPubli

class OfertaService(OfertaUseCase):
    OFERTA_NOT_FOUND = "Oferta no encontrada"
    OFERTA_NOT_PENDING = "La oferta no está pendiente"  

    def __init__(self, repo: OfertaRepository, vector_repo: VectorDBRepository, embeddings: IEmbeddings):
        self.repo = repo
        self.vector_repo = vector_repo
        self.embeddings = embeddings

    def registrar(self, oferta: Oferta) -> Oferta:
        if not oferta.estado:
            oferta.estado = EstadoOferta.PENDIENTE
        if not oferta.estadoPubli:
            oferta.estadoPubli = EstadoPubli.NO_PUBLICADA

        oferta_guardada = self.repo.guardar(oferta)

        embedding = self.embeddings.generar_embedding_oferta(oferta_guardada)
        self.vector_repo.agregar_oferta(oferta_guardada, embedding)

        return oferta_guardada

    def obtener_todos(self) -> List[Oferta]:
        return self.repo.obtener_todos()

    def obtener_por_id(self, id: int) -> Optional[Oferta]:
        oferta = self.repo.obtener_por_id(id)
        if not oferta:
            raise HTTPException(status_code=404, detail=self.OFERTA_NOT_FOUND)
        return oferta

    def actualizar(self, id: int, data: dict) -> Optional[Oferta]:
        oferta = self.repo.actualizar(id, data)
        if not oferta:
            raise HTTPException(status_code=404, detail=self.OFERTA_NOT_FOUND)
        return oferta

    def eliminar(self, id: int) -> bool:
        if not self.repo.eliminar(id):
            raise HTTPException(status_code=404, detail=self.OFERTA_NOT_FOUND)
        return True

    def aprobar_oferta(self, id: int) -> Oferta:
        oferta = self.repo.obtener_por_id(id)
        if not oferta:
            raise HTTPException(status_code=404, detail=self.OFERTA_NOT_FOUND)

        if oferta.estado != "PENDIENTE":
            raise HTTPException(
                status_code=400, detail=self.OFERTA_NOT_PENDING)

        updated_data = {
            "estado": "ACTIVA",
            "estadoPubli": "PUBLICADA"
        }

        oferta_actualizada = self.repo.actualizar(id, updated_data)
        return oferta_actualizada

    def rechazar_oferta(self, id: int, motivo: str) -> Oferta:
        oferta = self.repo.obtener_por_id(id)
        if not oferta:
            raise HTTPException(status_code=404, detail=self.OFERTA_NOT_FOUND)

        if oferta.estado != "PENDIENTE":
            raise HTTPException(
                status_code=400, detail=self.OFERTA_NOT_PENDING)

        updated_data = {
            "estado": "CERRADA",
            "estadoPubli": "NO_PUBLICADA",
            "motivo": motivo
        }

        oferta_actualizada = self.repo.actualizar(id, updated_data)
        return oferta_actualizada

    def obtener_ofertas_por_empresa(self, id_empresa: int) -> List[Oferta]:
        ofertas = self.repo.obtener_ofertas_por_empresa(id_empresa)
        if not ofertas:
            raise HTTPException(status_code=404, detail="No se encontraron ofertas para esta empresa")
        return ofertas