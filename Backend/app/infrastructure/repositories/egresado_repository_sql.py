from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from app.domain.models.egresado import Egresado as EgresadoDomain
from app.domain.interfaces.external.egresado_repository import EgresadoRepository
from app.infrastructure.orm_models.egresado_orm import EgresadoORM


class EgresadoRepositorySQL(EgresadoRepository):
    def __init__(self, db: Session):
        self.db = db

    def registrar_egresado(self, egresado: EgresadoDomain) -> EgresadoDomain:
        orm = self._to_orm(egresado)
        self.db.add(orm)
        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def obtener_egresados(self) -> List[EgresadoDomain]:
        egresados = self.db.query(EgresadoORM).all()
        return [self._to_domain(e) for e in egresados]

    def obtener_egresado_por_id(self, id: int) -> Optional[EgresadoDomain]:
        orm = self.db.query(EgresadoORM).filter(EgresadoORM.id == id).first()
        return self._to_domain(orm) if orm else None
    
    def obtener_nombres_por_ids(self, ids: List[int]) -> List[Dict]:
        egresados = (
            self.db.query(EgresadoORM.id, EgresadoORM.nombres, EgresadoORM.apellidos)
            .filter(EgresadoORM.id.in_(ids))
            .all()
        )
        return [{"id": e.id, "nombres": e.nombres, "apellidos": e.apellidos} for e in egresados]

    def actualizar_egresado(self, egresado: EgresadoDomain) -> Optional[EgresadoDomain]:
        orm = self.db.query(EgresadoORM).filter(EgresadoORM.id == egresado.id).first()
        if not orm:
            return None
        
        campos_editables = [
            "apellidos", "tipoDoc", "numDoc", "email", "telefono",
            "direccion", "nacionalidad", "fechaNacimiento",
            "linkedin", "github", "cv", "disponibilidad"
        ]

        for campo in campos_editables:
            if hasattr(egresado, campo):
                setattr(orm, campo, getattr(egresado, campo))

        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def eliminar_egresado(self, id: int) -> bool:
        orm = self.db.query(EgresadoORM).filter(EgresadoORM.id == id).first()
        if orm:
            self.db.delete(orm)
            self.db.commit()
            return True
        return False

    def existe_por_email(self, email: str) -> bool:
        return self.db.query(EgresadoORM).filter(EgresadoORM.email == email).first() is not None

    def existe_por_num_doc(self, num_doc: str) -> bool:
        return self.db.query(EgresadoORM).filter(EgresadoORM.numDoc == num_doc).first() is not None

    def _update_fields(self, target: EgresadoORM, source: EgresadoORM):
        for attr in vars(source):
            if not attr.startswith("_") and hasattr(target, attr) and attr != "id":
                setattr(target, attr, getattr(source, attr))

    def _to_orm(self, egresado: EgresadoDomain) -> EgresadoORM:
        return EgresadoORM(
            id=egresado.id,
            nombres=egresado.nombres,
            apellidos=egresado.apellidos,
            tipoDoc=egresado.tipoDoc,
            numDoc=egresado.numDoc,
            email=egresado.email,
            telefono=egresado.telefono,
            direccion=egresado.direccion,
            nacionalidad=egresado.nacionalidad,
            fechaNacimiento=egresado.fechaNacimiento,
            habilidades=egresado.habilidades,
            logrosAcademicos=egresado.logrosAcademicos,
            certificados=egresado.certificados,
            experienciaLaboral=egresado.experienciaLaboral,
            idiomas=egresado.idiomas,
            linkedin=egresado.linkedin,
            github=egresado.github,
            cv=egresado.cv,
            disponibilidad=egresado.disponibilidad
        )

    def _to_domain(self, orm: EgresadoORM) -> EgresadoDomain:
        return EgresadoDomain(
            id=orm.id,
            nombres=orm.nombres,
            apellidos=orm.apellidos,
            tipoDoc=orm.tipoDoc,
            numDoc=orm.numDoc,
            email=orm.email,
            telefono=orm.telefono,
            direccion=orm.direccion,
            nacionalidad=orm.nacionalidad,
            fechaNacimiento=orm.fechaNacimiento,
            habilidades=orm.habilidades,
            logrosAcademicos=orm.logrosAcademicos,
            certificados=orm.certificados,
            experienciaLaboral=orm.experienciaLaboral,
            idiomas=orm.idiomas,
            linkedin=orm.linkedin,
            github=orm.github,
            cv=orm.cv,
            disponibilidad=orm.disponibilidad
        )
