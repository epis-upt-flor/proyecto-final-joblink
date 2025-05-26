from sqlalchemy.orm import Session
import numpy as np
from app.infrastructure.orm_models.oferta_orm import OfertaORM
from app.infrastructure.orm_models.egresado_orm import EgresadoORM
from app.infrastructure.repositories.postulacion_repository_sql import PostulacionRepositorySQL
from app.application.services.postulacion_service import PostulacionService
from app.infrastructure.embeddings.embeddings_generator import GeneradorEmbeddings
from upstash_vector import Index, Vector
import os
from dotenv import load_dotenv

class RecomendadorService:
    @staticmethod
    def _get_vector_db():
        load_dotenv()
        url = os.getenv("UPSTASH_URL", "").strip()
        token = os.getenv("UPSTASH_TOKEN", "").strip()
        return Index(url=url, token=token)

    @staticmethod
    def _cosine_similarity(vec1, vec2):
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
    
    def agregar_egresado_a_vector_db(self, egresado: EgresadoORM):
        vector_db = self._get_vector_db()
        embeddings = GeneradorEmbeddings()
        vector = embeddings.generar_embedding_egresado(egresado)

        vector_db.upsert([
            Vector(
                id=str(egresado.id),
                vector=vector,
                metadata={
                    "nombres": egresado.nombres,
                    "habilidades": egresado.habilidades,
                    "experienciaLaboral": egresado.experienciaLaboral,
                    "certificados": egresado.certificados,
                    "idiomas": egresado.idiomas,
                    "logrosAcademicos": egresado.logrosAcademicos
                }
            )
        ])

    def agregar_oferta_a_vector_db(self, oferta: OfertaORM):
        vector_db = self._get_vector_db()
        embeddings = GeneradorEmbeddings()
        embedding = embeddings.generar_embedding_oferta(oferta)

        vector_db.upsert([
            Vector(
                id=f"oferta-{oferta.id}",
                vector=embedding,
                metadata={
                    "titulo": oferta.titulo,
                    "funciones": oferta.funciones,
                    "requisitos": oferta.requisitos,
                    "area": oferta.area,
                    "experiencia": oferta.experiencia
                }
            )
        ])
        
    def _obtener_contratos_historicos(self, db: Session):
        repo = PostulacionRepositorySQL(db)
        postulaciones = repo.obtener_postulaciones_contrato()

        contratos = []
        for p in postulaciones:
            egresado = p.egresado
            oferta = p.oferta
            contratos.append((oferta, egresado))

        return contratos

    def recomendar(self, oferta_id: int, db: Session):
        vector_db = self._get_vector_db()
        embeddings = GeneradorEmbeddings()
        postulacion_service = PostulacionService()

        oferta = db.query(OfertaORM).filter(OfertaORM.id == oferta_id).first()
        if not oferta:
            return {"error": "Oferta no encontrada"}

        texto_oferta = f"{oferta.titulo} {oferta.funciones or ''} {oferta.requisitos or ''} {oferta.area or ''} {oferta.experiencia or ''}"
        print("🧠 Texto de la oferta para el embedding:")
        print(texto_oferta)

        vector_query = embeddings.generar_embedding_oferta(oferta)
        response = vector_db.query(vector=vector_query, top_k=10, include_metadata=True, include_vectors=True)

        contratos_historicos = self._obtener_contratos_historicos(db)
        bonus_por_historico = 5

        recomendaciones = []

        print("\n📊 Resultados de similitud:")
        for item in response:
            eid = item.id
            if eid.startswith("oferta-"):
                continue

            if not hasattr(item, "vector") or item.vector is None:
                print(f"⚠️ item.vector no disponible para egresado {eid}, se omite.")
                continue

            nombres = item.metadata.get("nombres")
            habilidades = item.metadata.get("habilidades")
            experienciaLaboral = item.metadata.get("experienciaLaboral")
            certificados = item.metadata.get("certificados")
            idiomas = item.metadata.get("idiomas")
            logrosAcademicos = item.metadata.get("logrosAcademicos")
            score = round(item.score * 100, 2)

            for oferta_hist, egresado_hist in contratos_historicos:
                texto_hist = f"{oferta_hist.titulo} {oferta_hist.requisitos or ''}"
                emb_hist = embeddings.generar_embedding_texto(texto_hist)
                if emb_hist is None:
                    print(f"⚠️ No se pudo generar embedding de la oferta histórica {oferta_hist.id}")
                    continue

                similitud_oferta = self._cosine_similarity(vector_query, emb_hist)
                print(f"📄 Similitud con oferta histórica {oferta_hist.id}: {similitud_oferta:.4f}")

                if similitud_oferta > 0.6:
                    emb_egresado_actual = item.vector
                    emb_egresado_hist = embeddings.generar_embedding_egresado(egresado_hist)
                    if emb_egresado_hist is None:
                        print(f"⚠️ No se pudo generar embedding del egresado histórico {egresado_hist.id}")
                        continue

                    similitud_egresado = self._cosine_similarity(emb_egresado_actual, emb_egresado_hist)
                    print(f"↪ Comparando egresado actual {eid} con contratado {egresado_hist.id}: {similitud_egresado:.4f}")

                    if similitud_egresado > 0.8:
                        score += bonus_por_historico
                        print(f"🎯 Bonus por similitud con historial: +{bonus_por_historico} al egresado {eid}")

            recomendaciones.append({
                "id": int(eid),
                "nombres": nombres,
                "habilidades": habilidades,
                "experienciaLaboral": experienciaLaboral,
                "certificados": certificados,
                "idiomas": idiomas,
                "logrosAcademicos": logrosAcademicos,
                "score": score
            })

        recomendaciones = sorted(recomendaciones, key=lambda x: x["score"], reverse=True)[:3]

        for idx, rec in enumerate(recomendaciones, start=1):
            postulacion_service.crear_postulacion(oferta_id, rec["id"], idx, db)

        return {
            "criterios_usados": texto_oferta,
            "recomendaciones": recomendaciones
        }
