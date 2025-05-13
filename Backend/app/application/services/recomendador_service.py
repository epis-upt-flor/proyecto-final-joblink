from upstash_vector import Index, Vector
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.infrastructure.orm_models.oferta_orm import OfertaORM
from app.infrastructure.orm_models.egresado_orm import EgresadoORM
from app.infrastructure.embeddings.embeddings_generator import GeneradorEmbeddings
from app.application.services.postulacion_service import PostulacionService


class RecomendadorService:
    @staticmethod
    def _get_vector_db():
        load_dotenv()
        url = os.getenv("UPSTASH_URL", "").strip()
        token = os.getenv("UPSTASH_TOKEN", "").strip()
        return Index(url=url, token=token)

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
        response = vector_db.query(vector=vector_query, top_k=10, include_metadata=True)

        recomendaciones = []

        print("\n📊 Resultados de similitud:")
        for item in response:
            eid = item.id
            if eid.startswith("oferta-"):
                continue

            nombres = item.metadata.get("nombres")
            habilidades = item.metadata.get("habilidades")
            experienciaLaboral = item.metadata.get("experienciaLaboral")
            certificados = item.metadata.get("certificados")
            idiomas = item.metadata.get("idiomas")
            logrosAcademicos = item.metadata.get("logrosAcademicos")
            score = round(item.score * 100, 2)

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
