from typing import List
from upstash_vector import Vector
from app.infrastructure.database.vector_provider import VectorDBProvider
from app.domain.interfaces.external.vector_db_repository import VectorDBRepository


class VectorDBRepositoryUpstash(VectorDBRepository):
    def __init__(self):
        self.vector_db = VectorDBProvider.get_index()

    def agregar_egresado(self, egresado, vector: List[float]):
        self.vector_db.upsert([
            Vector(
                id=str(egresado.id),
                vector=vector,
                metadata={
                    "nombres": egresado.nombres,
                    "habilidades": egresado.habilidades or [],
                    "logrosAcademicos": egresado.logrosAcademicos or [],
                    "certificados": egresado.certificados or [],
                    "experienciaLaboral": egresado.experienciaLaboral or [],
                    "idiomas": egresado.idiomas or []
                }
            )
        ])

    def agregar_oferta(self, oferta, vector: List[float]):
        self.vector_db.upsert([
            Vector(
                id=f"oferta-{oferta.id}",
                vector=vector,
                metadata={
                    "titulo": oferta.titulo,
                    "area": oferta.area,
                    "experiencia": oferta.experiencia,
                    "funciones": oferta.funciones or [],
                    "requisitos": oferta.requisitos or []
                }
            )
        ])

    def buscar_similares(self, vector: List[float], top_k: int = 10):
        return self.vector_db.query(
            vector=vector,
            top_k=top_k,
            include_metadata=True
        )
