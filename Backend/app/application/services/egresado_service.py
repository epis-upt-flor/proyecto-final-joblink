from typing import List, Optional
from app.domain.models.egresado import Egresado
from app.domain.interfaces.external.egresado_repository import EgresadoRepository
from app.domain.interfaces.internal.egresado_usecase import EgresadoUseCase
from fastapi import HTTPException
from app.domain.interfaces.external.vector_db_repository import VectorDBRepository
from app.infrastructure.embeddings.embeddings_generator import GeneradorEmbeddings

class EgresadoService(EgresadoUseCase):
    EGRESADO_NOT_FOUND = "Egresado no encontrado"
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
    
    def registrar_egresados_masivo(self, egresados: List[Egresado]) -> dict:
        egresados_validos = []
        egresados_omitidos = []

        for e in egresados:
            email_duplicado = self.repository.existe_por_email(e.email)
            doc_duplicado = self.repository.existe_por_num_doc(e.numDoc)

            if email_duplicado or doc_duplicado:
                motivos = []
                if email_duplicado:
                    motivos.append("correo ya registrado")
                if doc_duplicado:
                    motivos.append("número de documento ya registrado")
                egresados_omitidos.append({
                    "nombres": f"{e.nombres} {e.apellidos}",
                    "email": e.email,
                    "numDoc": e.numDoc,
                    "motivos": motivos
                })
            else:
                egresados_validos.append(e)

        if not egresados_validos:
            return {
                "agregados": 0,
                "omitidos": egresados_omitidos,
                "mensaje": "No se agregaron egresados porque todos los registros contenían datos ya existentes."
            }

        egresados_guardados = self.repository.registrar_egresados_masivo(egresados_validos)

        for e in egresados_guardados:
            embedding = self.embeddings.generar_embedding_egresado(e)
            self.vector_repo.agregar_egresado(e, embedding)

        return {
            "agregados": len(egresados_guardados),
            "ids": [e.id for e in egresados_guardados],
            "omitidos": egresados_omitidos,
            "mensaje": f"{len(egresados_guardados)} egresados registrados correctamente."
        }

    def obtener_todos(self) -> List[Egresado]:
        return self.repository.obtener_egresados()

    def obtener_por_id(self, id: int) -> Optional[Egresado]:
        egresado = self.repository.obtener_egresado_por_id(id)
        if not egresado:
            raise HTTPException(
                status_code=404, detail=self.EGRESADO_NOT_FOUND)
        return egresado

    def actualizar_egresado(self, id: int, cambios: dict) -> Optional[Egresado]:
        egresado = self.repository.obtener_egresado_por_id(id)
        if not egresado:
            raise HTTPException(status_code=404, detail=self.EGRESADO_NOT_FOUND)

        campos_prohibidos = {
            "nombres", "habilidades", "logrosAcademicos",
            "certificados", "experienciaLaboral", "idiomas"
        }
        for campo in cambios:
            if campo in campos_prohibidos:
                raise HTTPException(
                    status_code=400, detail=f"No se permite editar el campo '{campo}'")

        for campo, valor in cambios.items():
            setattr(egresado, campo, valor)

        actualizado = self.repository.actualizar_egresado(egresado)
        if not actualizado:
            raise HTTPException(status_code=404, detail=self.EGRESADO_NOT_FOUND)
        return actualizado

    def eliminar_egresado(self, id: int) -> bool:
        if not self.repository.eliminar_egresado(id):
            raise HTTPException(
                status_code=404, detail=self.EGRESADO_NOT_FOUND)
        return True
