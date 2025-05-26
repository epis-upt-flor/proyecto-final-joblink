from typing import List, Optional
from fastapi import HTTPException
from app.domain.models.oferta import Oferta
from app.domain.interfaces.internal.oferta_usecase import OfertaUseCase
from app.domain.interfaces.external.oferta_repository import OfertaRepository
from app.domain.interfaces.external.vector_db_repository import VectorDBRepository
from app.infrastructure.embeddings.embeddings_generator import GeneradorEmbeddings


class OfertaService(OfertaUseCase):
    def __init__(self, repo: OfertaRepository, vector_repo: VectorDBRepository):
        self.repo = repo
        self.vector_repo = vector_repo
        self.embeddings = GeneradorEmbeddings()

    def registrar(self, oferta: Oferta) -> Oferta:
        oferta_guardada = self.repo.guardar(oferta)

        embedding = self.embeddings.generar_embedding_oferta(oferta_guardada)
        self.vector_repo.agregar_oferta(oferta_guardada, embedding)

        return oferta_guardada

    def obtener_todos(self) -> List[Oferta]:
        return self.repo.obtener_todos()

    def obtener_por_id(self, id: int) -> Optional[Oferta]:
        oferta = self.repo.obtener_por_id(id)
        if not oferta:
            raise HTTPException(status_code=404, detail="Oferta no encontrada")
        return oferta

    def actualizar(self, id: int, data: dict) -> Optional[Oferta]:
        oferta = self.repo.actualizar(id, data)
        if not oferta:
            raise HTTPException(status_code=404, detail="Oferta no encontrada")
        return oferta

    def eliminar(self, id: int) -> bool:
        if not self.repo.eliminar(id):
            raise HTTPException(status_code=404, detail="Oferta no encontrada")
        return True
