from typing import List
from datetime import date
from sklearn.metrics.pairwise import cosine_similarity

from app.domain.interfaces.internal.recomendador_usecase import RecomendadorUseCase
from app.domain.interfaces.external.vector_db_repository import VectorDBRepository
from app.domain.interfaces.external.contrato_repository import ContratoRepository
from app.domain.interfaces.external.egresado_repository import EgresadoRepository
from app.domain.interfaces.external.oferta_repository import OfertaRepository
from app.domain.interfaces.external.postulacion_repository import PostulacionRepository

from app.application.services.postulacion_service import PostulacionService
from app.infrastructure.embeddings.embeddings_generator import GeneradorEmbeddings

from app.domain.models.enum import EstadoContrato, EstadoPostulacion
from app.domain.models.postulacion import Postulacion
class RecomendadorService(RecomendadorUseCase):
    TOP_K_SIMILARES = 10
    TOP_RECOMENDACIONES = 3
    PESO_OFERTA = 0.7
    PESO_CONTRATADOS = 0.3
    def __init__(
        self,
        vector_repo: VectorDBRepository,
        oferta_repo: OfertaRepository,
        contrato_repo: ContratoRepository,
        egresado_repo: EgresadoRepository,
        postulacion_repo: PostulacionRepository,
        postulacion_service: PostulacionService
    ):
        self.vector_repo = vector_repo
        self.oferta_repo = oferta_repo
        self.contrato_repo = contrato_repo
        self.egresado_repo = egresado_repo
        self.postulacion_repo = postulacion_repo
        self.postulacion_service = postulacion_service
        self.embeddings = GeneradorEmbeddings()

    def recomendar(self, oferta_id: int,db_session) -> dict:
        oferta = self.oferta_repo.obtener_por_id(oferta_id)
        if not oferta:
            return {"error": "Oferta no encontrada"}
        vector_oferta = self.embeddings.generar_embedding_oferta(oferta)
        similares = self.vector_repo.buscar_similares(vector_oferta, top_k=self.TOP_K_SIMILARES)
        egresados_contratados = self._obtener_egresados_por_empresa(oferta.idEmpresa)
        candidatos = self._filtrar_y_construir_candidatos(similares, egresados_contratados)
        egresados_contratados_objs = [
            self.egresado_repo.obtener_egresado_por_id(eid) for eid in egresados_contratados
        ]

        for candidato in candidatos:
            self._calcular_scores_candidato(candidato, egresados_contratados_objs)

        candidatos = sorted(candidatos, key=lambda x: x["score_final"], reverse=True)[:self.TOP_RECOMENDACIONES]
        self._registrar_recomendaciones(candidatos, oferta.id)
        return self._formatear_resultado(candidatos, oferta)



    def _obtener_egresados_por_empresa(self, id_empresa: int) -> set:
        contratos = self.contrato_repo.obtener_contratos()
        egresados_ids = set()
        for contrato in contratos:
            if contrato.estado != EstadoContrato.VIGENTE or not contrato.idOfertaEgresado:
                continue

            postulacion = self.postulacion_repo.obtener_postulacion_por_id(contrato.idOfertaEgresado)
            if not postulacion:
                continue

            oferta_rel = self.oferta_repo.obtener_por_id(postulacion.idOferta)
            if oferta_rel and oferta_rel.idEmpresa == id_empresa:
                egresados_ids.add(postulacion.idEgresado)

        return egresados_ids

    def _filtrar_y_construir_candidatos(self, similares: List, egresados_contratados_ids: set) ->List[dict]: 
        candidatos = []
        for item in similares:
            if item.id.startswith("oferta-"):
                continue
            egresado_id = int(item.id)
            if egresado_id in egresados_contratados_ids:
                continue
            candidatos.append({
                "id": egresado_id,
                "nombres": item.metadata.get("nombres"),
                "score_oferta": item.score,
                "metadata": item.metadata
            })
        return candidatos

    def _calcular_scores_candidato(self, candidato, egresados_contratados_objs):
        egresado = self.egresado_repo.obtener_egresado_por_id(candidato["id"])
        if not egresado or not egresados_contratados_objs:
            candidato["score_contratados"] = 0.0
            candidato["score_final"] = candidato["score_oferta"]
            return

        vec_egresado = self.embeddings.generar_embedding_egresado(egresado)
        similitudes = [
            cosine_similarity([vec_egresado], [self.embeddings.generar_embedding_egresado(ec)])[0][0]
            for ec in egresados_contratados_objs if ec
        ]
        
        if not similitudes:
            promedio = 0.0
        else:
            promedio = sum(similitudes) / len(similitudes)

        candidato["score_contratados"] = promedio
        candidato["score_final"] = (
            self.PESO_OFERTA * candidato["score_oferta"] +
            self.PESO_CONTRATADOS * promedio
        )

    def _registrar_recomendaciones(self, candidatos, id_oferta):
        for idx, rec in enumerate(candidatos, start=1):
            postulacion = Postulacion(
                id=None,
                idOferta=id_oferta,
                idEgresado=rec["id"],
                fechaRecomendacion=date.today(),
                posicionRanking=idx,
                estado=EstadoPostulacion.RECOMENDADO
            )
            self.postulacion_service.registrar_postulacion(postulacion)

    def _formatear_resultado(self, candidatos, oferta):
        return {
            "criterios_usados": f"{oferta.titulo} {oferta.funciones or ''} {oferta.requisitos or ''}",
            "recomendaciones": [
                {
                    "id": c["id"],
                    "nombres": c["nombres"],
                    "score_oferta": round(c["score_oferta"] * 100, 2),
                    "score_contratados": round(c["score_contratados"] * 100, 2),
                    "score_final": round(c["score_final"] * 100, 2),
                }
                for c in candidatos
            ]
        }
    

