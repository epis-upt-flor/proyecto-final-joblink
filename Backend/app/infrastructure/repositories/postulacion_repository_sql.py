from sqlalchemy.orm import Session
from app.infrastructure.orm_models.postulacion_orm import PostulacionORM
from app.infrastructure.orm_models.contrato_orm import ContratoORM
from app.infrastructure.orm_models.oferta_orm import OfertaORM

class PostulacionRepositorySQL:
    def __init__(self, db: Session):
        self.db = db

    def obtener_postulaciones_contrato(self):
        return (
            self.db.query(PostulacionORM)
            .join(ContratoORM, ContratoORM.idOfertaEgresado == PostulacionORM.id)
            .join(OfertaORM, OfertaORM.id == PostulacionORM.idOferta)
            .all()
        )
