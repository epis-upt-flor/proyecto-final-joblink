from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.domain.models.oferta import Oferta as OfertaDomain
from app.infrastructure.orm_models.oferta_orm import OfertaORM
from app.domain.interfaces.external.oferta_repository import OfertaRepository


class OfertaRepositorySQL(OfertaRepository):
    def __init__(self, db: Session):
        self.db = db

    def guardar(self, oferta: OfertaDomain) -> OfertaDomain:
        orm = self._to_orm(oferta)
        self.db.add(orm)
        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def obtener_todos(self) -> List[OfertaDomain]:
        ofertas = self.db.query(OfertaORM).options(
            joinedload(OfertaORM.empresa)).all()
        return [self._to_domain(o) for o in ofertas]

    def obtener_por_id(self, id: int) -> Optional[OfertaDomain]:
        orm = self.db.query(OfertaORM).filter(OfertaORM.id == id).first()
        return self._to_domain(orm) if orm else None

    def actualizar(self, id: int, data: dict) -> Optional[OfertaDomain]:
        orm = self.db.query(OfertaORM).filter(OfertaORM.id == id).first()
        if not orm:
            return None

        for key, value in data.items():
            if hasattr(orm, key) and value is not None:
                setattr(orm, key, value)

        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def eliminar(self, id: int) -> bool:
        orm = self.db.query(OfertaORM).filter(OfertaORM.id == id).first()
        if orm:
            self.db.delete(orm)
            self.db.commit()
            return True
        return False
    
    def obtener_ofertas_por_empresa(self, id_empresa: int) -> List[OfertaDomain]:
        ofertas = self.db.query(OfertaORM).filter(OfertaORM.idEmpresa == id_empresa).all()
        return [self._to_domain(o) for o in ofertas] if ofertas else []

    # -------------------- 🔄 Mappers --------------------

    def _to_orm(self, domain: OfertaDomain) -> OfertaORM:
        return OfertaORM(
            titulo=domain.titulo,
            tipo=domain.tipo,
            fechaCierre=domain.fechaCierre,
            area=domain.area,
            modalidad=domain.modalidad,
            horario=domain.horario,
            vacantes=domain.vacantes,
            experiencia=domain.experiencia,
            locacion=domain.locacion,
            salario=domain.salario,
            funciones=domain.funciones,
            requisitos=domain.requisitos,
            estado=domain.estado,
            motivo=domain.motivo,
            beneficios=domain.beneficios,
            fechaInicio=domain.fechaInicio,
            tiempo=domain.tiempo,
            fechaPubli=domain.fechaPubli,
            estadoPubli=domain.estadoPubli,
            idEmpresa=domain.idEmpresa,
        )

    def _to_domain(self, orm: OfertaORM) -> OfertaDomain:
        empresa_data = None
        if orm.empresa:
            empresa_data = {
                "id": orm.empresa.id,
                "nombre": orm.empresa.nombre,
                "logo": orm.empresa.logo
            }

        return OfertaDomain(
            id=orm.id,
            titulo=orm.titulo,
            tipo=orm.tipo,
            fechaCierre=orm.fechaCierre,
            area=orm.area,
            modalidad=orm.modalidad,
            horario=orm.horario,
            vacantes=orm.vacantes,
            experiencia=orm.experiencia,
            locacion=orm.locacion,
            salario=float(orm.salario) if orm.salario is not None else None,
            funciones=orm.funciones,
            requisitos=orm.requisitos,
            estado=orm.estado,
            motivo=orm.motivo,
            beneficios=orm.beneficios,
            fechaInicio=orm.fechaInicio,
            tiempo=orm.tiempo,
            fechaPubli=orm.fechaPubli,
            estadoPubli=orm.estadoPubli,
            idEmpresa=orm.idEmpresa,
            empresa=empresa_data
        )
