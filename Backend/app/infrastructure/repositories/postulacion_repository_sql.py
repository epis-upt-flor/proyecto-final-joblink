from sqlalchemy.orm import Session
from typing import List, Optional
from app.domain.models.postulacion import Postulacion
from app.domain.models.enum import EstadoPostulacion
from app.domain.interfaces.external.postulacion_repository import PostulacionRepository
from app.infrastructure.orm_models.postulacion_orm import PostulacionORM


class PostulacionRepositorySQL(PostulacionRepository):
    def __init__(self, db: Session):
        self.db = db

    def registrar_postulacion(self, postulacion: Postulacion) -> Postulacion:
        orm = self._to_orm(postulacion)
        self.db.add(orm)
        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def obtener_postulaciones(self) -> List[Postulacion]:
        return [self._to_domain(p) for p in self.db.query(PostulacionORM).all()]

    def obtener_postulacion_por_id(self, id: int) -> Optional[Postulacion]:
        orm = self.db.query(PostulacionORM).filter(
            PostulacionORM.id == id).first()
        return self._to_domain(orm) if orm else None

    def actualizar_postulacion(self, postulacion: Postulacion) -> Optional[Postulacion]:
        orm = self.db.query(PostulacionORM).filter(
            PostulacionORM.id == postulacion.id).first()
        if not orm:
            return None
        updated = self._to_orm(postulacion)
        self._update_fields(orm, updated)
        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def eliminar_postulacion(self, id: int) -> bool:
        orm = self.db.query(PostulacionORM).filter(
            PostulacionORM.id == id).first()
        if orm:
            self.db.delete(orm)
            self.db.commit()
            return True
        return

    def obtener_postulaciones_por_oferta(self, id_oferta: int) -> List[dict]:
        postulaciones = (
            self.db.query(PostulacionORM)
            .join(PostulacionORM.egresado)
            .filter(PostulacionORM.idOferta == id_oferta)
            .all()
        )

        resultado = []
        for p in postulaciones:
            resultado.append({
                "id": p.id,
                "idOferta": p.idOferta,
                "idEgresado": p.idEgresado,
                "fechaRecomendacion": p.fechaRecomendacion,
                "posicionRanking": p.posicionRanking,
                "estado": p.estado,
                "egresado": {
                    "nombres": p.egresado.nombres,
                    "apellidos": p.egresado.apellidos,
                }
            })

        return resultado

    def obtener_postulaciones_por_empresa(self, id_empresa: int) -> List[Postulacion]:
        from app.infrastructure.orm_models.oferta_orm import OfertaORM
        ofertas_ids = self.db.query(OfertaORM.id).filter(
            OfertaORM.idEmpresa == id_empresa).all()
        ids = [o[0] for o in ofertas_ids]
        postulaciones = self.db.query(PostulacionORM).filter(
            PostulacionORM.idOferta.in_(ids)).all()
        return [self._to_domain(p) for p in postulaciones]

    def _update_fields(self, target: PostulacionORM, source: PostulacionORM):
        for attr in vars(source):
            if not attr.startswith("_") and hasattr(target, attr) and attr != "id":
                setattr(target, attr, getattr(source, attr))

    def _to_orm(self, postulacion: Postulacion) -> PostulacionORM:
        return PostulacionORM(
            id=postulacion.id,
            idOferta=postulacion.idOferta,
            idEgresado=postulacion.idEgresado,
            fechaRecomendacion=postulacion.fechaRecomendacion,
            posicionRanking=postulacion.posicionRanking,
            estado=postulacion.estado.value
        )

    def _to_domain(self, orm: PostulacionORM) -> Postulacion:
        return Postulacion(
            id=orm.id,
            idOferta=orm.idOferta,
            idEgresado=orm.idEgresado,
            fechaRecomendacion=orm.fechaRecomendacion,
            posicionRanking=orm.posicionRanking,
            estado=EstadoPostulacion(orm.estado)
        )
