from app.infrastructure.orm_models.oferta_orm import OfertaORM
from app.infrastructure.orm_models.postulacion_orm import PostulacionORM
from sqlalchemy.orm import Session,joinedload
from typing import List, Optional
from app.domain.models.contrato import Contrato
from app.domain.interfaces.external.contrato_repository import ContratoRepository
from app.infrastructure.orm_models.contrato_orm import ContratoORM


class ContratoRepositorySQL(ContratoRepository):
    def __init__(self, db: Session):
        self.db = db

    def registrar_contrato(self, contrato: Contrato) -> Contrato:
        orm = self._to_orm(contrato)
        self.db.add(orm)
        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def obtener_contratos(self) -> List[dict]:
        contratos = (
            self.db.query(ContratoORM)
            .options(
                joinedload(ContratoORM.postulacion)
                .joinedload(PostulacionORM.egresado),
                
                joinedload(ContratoORM.postulacion)
                .joinedload(PostulacionORM.oferta)
                .joinedload(OfertaORM.empresa)
            )
            .all()
        )

        resultado = []
        for contrato in contratos:
            postulacion = contrato.postulacion
            egresado = postulacion.egresado if postulacion else None
            oferta = postulacion.oferta if postulacion else None
            empresa = oferta.empresa if oferta else None

            resultado.append({
                "id": contrato.id,
                "fechaFin": contrato.fechaFin,
                "estado": contrato.estado,
                "nombreEgresado": f"{egresado.nombres} {egresado.apellidos}" if egresado else None,
                "iniciales": f"{egresado.nombres[0]}{egresado.apellidos[0]}" if egresado else "",
                "empresa": empresa.nombre if empresa else None,
                "puesto": oferta.titulo if oferta else None,
                "recomendado": True
            })
        return resultado

    def obtener_contrato_por_id(self, id: int) -> Optional[Contrato]:
        orm = self.db.query(ContratoORM).filter(ContratoORM.id == id).first()
        return self._to_domain(orm) if orm else None

    def actualizar_contrato(self, contrato: Contrato) -> Optional[Contrato]:
        orm = self.db.query(ContratoORM).filter(
            ContratoORM.id == contrato.id).first()
        if not orm:
            return None
        updated = self._to_orm(contrato)
        self._update_fields(orm, updated)
        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def eliminar_contrato(self, id: int) -> bool:
        orm = self.db.query(ContratoORM).filter(ContratoORM.id == id).first()
        if orm:
            self.db.delete(orm)
            self.db.commit()
            return True
        return False

    def _update_fields(self, target: ContratoORM, source: ContratoORM):
        for attr in vars(source):
            if not attr.startswith("_") and hasattr(target, attr) and attr != "id":
                setattr(target, attr, getattr(source, attr))

    def _to_orm(self, contrato: Contrato) -> ContratoORM:
        return ContratoORM(
            id=contrato.id,
            idOfertaEgresado=contrato.idOfertaEgresado,
            fechaFin=contrato.fechaFin,
            estado=contrato.estado.value
        )

    def _to_domain(self, orm: ContratoORM) -> Contrato:
        from app.domain.models.enum import EstadoContrato
        return Contrato(
            id=orm.id,
            idOfertaEgresado=orm.idOfertaEgresado,
            fechaFin=orm.fechaFin,
            estado=EstadoContrato(orm.estado)
        )
