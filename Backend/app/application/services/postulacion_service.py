from sqlalchemy.orm import Session
from datetime import datetime

from app.infrastructure.orm_models.postulacion_orm import PostulacionORM
from app.domain.models.postulacion import Postulacion
from app.domain.interfaces.internal.postulacion_usecase import PostulacionUseCase


class PostulacionService(PostulacionUseCase):

    def crear_postulacion(self, oferta_id: int, egresado_id: int, posicion: int, db: Session) -> Postulacion:
        existe = db.query(PostulacionORM).filter_by(idOferta=oferta_id, idEgresado=egresado_id).first()
        if existe:
            print(f"⚠️ Ya existe una postulación para el egresado {egresado_id} en la oferta {oferta_id}.")
            return None

        estado = "en_revision"

        nueva_postulacion = PostulacionORM(
            idOferta=oferta_id,
            idEgresado=egresado_id,
            estado=estado,
            posicionRanking=posicion,
            fechaRecomendacion=datetime.now()
        )

        db.add(nueva_postulacion)
        db.commit()
        db.refresh(nueva_postulacion)

        print(f"✅ Postulación creada para egresado {egresado_id} en oferta {oferta_id} (posición: {posicion})")

        return Postulacion(
            id=nueva_postulacion.id,
            idOferta=nueva_postulacion.idOferta,
            idEgresado=nueva_postulacion.idEgresado,
            estado=nueva_postulacion.estado,
            posicionRanking=nueva_postulacion.posicionRanking,
            fechaRecomendacion=nueva_postulacion.fechaRecomendacion
        )