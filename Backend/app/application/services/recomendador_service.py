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

    def recomendar(self, oferta_id: int, db_session) -> dict:
        oferta = self.oferta_repo.obtener_por_id(oferta_id)
        if not oferta:
            return {"error": "Oferta no encontrada"}

        # 🎯 Obtener vector de la oferta
        vector_oferta = self.embeddings.generar_embedding_oferta(oferta)
        similares = self.vector_repo.buscar_similares(vector_oferta, top_k=10)

        # 🧠 Obtener egresados ya contratados por la empresa
        contratos = self.contrato_repo.obtener_contratos()
        egresados_contratados_ids = set()

        for contrato in contratos:
            if contrato.estado == EstadoContrato.VIGENTE and contrato.idOfertaEgresado:
                postulacion = self.postulacion_repo.obtener_postulacion_por_id(
                    contrato.idOfertaEgresado)
                if postulacion:
                    oferta_rel = self.oferta_repo.obtener_por_id(
                        postulacion.idOferta)
                    if oferta_rel and oferta_rel.idEmpresa == oferta.idEmpresa:
                        egresados_contratados_ids.add(postulacion.idEgresado)

        # 📋 Preparar candidatos excluyendo contratados
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

        # 🔁 Obtener egresados contratados para similitud
        egresados_contratados = [
            self.egresado_repo.obtener_egresado_por_id(eid)
            for eid in egresados_contratados_ids
        ]

        # 📊 Calcular similitud a contratados previos
        for candidato in candidatos:
            egresado_actual = self.egresado_repo.obtener_egresado_por_id(
                candidato["id"])
            if not egresado_actual or not egresados_contratados:
                candidato["score_contratados"] = 0.0
                candidato["score_final"] = candidato["score_oferta"]
                continue

            vec_actual = self.embeddings.generar_embedding_egresado(
                egresado_actual)
            similitudes = [
                cosine_similarity(
                    [vec_actual], [self.embeddings.generar_embedding_egresado(ec)])[0][0]
                for ec in egresados_contratados
                if ec
            ]
            promedio = sum(similitudes) / len(similitudes)
            candidato["score_contratados"] = promedio
            α, β = 0.7, 0.3
            candidato["score_final"] = α * \
                candidato["score_oferta"] + β * promedio

        # ✅ Ordenar por score final
        candidatos = sorted(
            candidatos, key=lambda x: x["score_final"], reverse=True)[:3]

        for idx, rec in enumerate(candidatos, start=1):
            nueva_postulacion = Postulacion(
                id=None,
                idOferta=oferta.id,
                idEgresado=rec["id"],
                fechaRecomendacion=date.today(),
                posicionRanking=idx,
                estado=EstadoPostulacion.RECOMENDADO
            )
            self.postulacion_service.registrar_postulacion(nueva_postulacion)

        return {
            "criterios_usados": f"{oferta.titulo} {oferta.funciones or ''} {oferta.requisitos or ''}",
            "recomendaciones": [
                {
                    "id": c["id"],
                    "nombres": c["nombres"],
                    "score_oferta": round(c["score_oferta"] * 100, 2),
                    "score_contratados": round(c["score_contratados"] * 100, 2),
                    "score_final": round(c["score_final"] * 100, 2)
                } for c in candidatos
            ]
        }
