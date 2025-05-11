from sqlalchemy.orm import Session
from app.domain.models.postulacion import Postulacion
from app.domain.models.enum import EstadoPostulacion

class PostulacionService:

    def crear_postulacion(self, oferta_id: int, egresado_id: int, posicion: int, db: Session):
        # Verificar si ya existe una postulación para este egresado y oferta
        existe = db.query(Postulacion).filter_by(idOferta=oferta_id, idEgresado=egresado_id).first()
        if existe:
            print(f"⚠️ Ya existe una postulación para el egresado {egresado_id} en la oferta {oferta_id}.")
            return None

        nueva_postulacion = Postulacion(
            idOferta=oferta_id,
            idEgresado=egresado_id,
            estado=EstadoPostulacion.en_revision,
            posicionRanking=posicion
        )
        db.add(nueva_postulacion)
        db.commit()
        db.refresh(nueva_postulacion)

        print(f"✅ Postulación creada para egresado {egresado_id} en oferta {oferta_id} (posición: {posicion})")
        return nueva_postulacion
