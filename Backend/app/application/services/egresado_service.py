from typing import List, Optional
from app.domain.models.egresado import Egresado
from app.domain.interfaces.external.egresado_repository import EgresadoRepository
from app.domain.interfaces.internal.egresado_usecase import EgresadoUseCase
from fastapi import HTTPException
from app.domain.interfaces.external.vector_db_repository import VectorDBRepository
from app.infrastructure.embeddings.embeddings_generator import GeneradorEmbeddings


class EgresadoService(EgresadoUseCase):
    def __init__(self, repository: EgresadoRepository, vector_repo: VectorDBRepository):
        self.repository = repository
        self.vector_repo = vector_repo
        self.embeddings = GeneradorEmbeddings()

    def registrar_egresado(self, egresado: Egresado) -> Egresado:
        if self.repository.existe_por_email(egresado.email):
            raise HTTPException(
                status_code=400, detail="El correo ya está registrado")
        if self.repository.existe_por_num_doc(egresado.numDoc):
            raise HTTPException(
                status_code=400, detail="El número de documento ya está registrado")
        egresado_guardado = self.repository.registrar_egresado(egresado)
        embedding = self.embeddings.generar_embedding_egresado(
            egresado_guardado)
        self.vector_repo.agregar_egresado(egresado_guardado, embedding)
        return egresado_guardado

    def obtener_todos(self) -> List[Egresado]:
        return self.repository.obtener_egresados()

    def obtener_por_id(self, id: int) -> Optional[Egresado]:
        egresado = self.repository.obtener_egresado_por_id(id)
        if not egresado:
            raise HTTPException(
                status_code=404, detail="Egresado no encontrado")
        return egresado

    def actualizar_egresado(self, egresado: Egresado) -> Optional[Egresado]:
        actualizado = self.repository.actualizar_egresado(egresado)
        if not actualizado:
            raise HTTPException(
                status_code=404, detail="Egresado no encontrado")
        return actualizado

    def eliminar_egresado(self, id: int) -> bool:
        if not self.repository.eliminar_egresado(id):
            raise HTTPException(
                status_code=404, detail="Egresado no encontrado")
        return True
