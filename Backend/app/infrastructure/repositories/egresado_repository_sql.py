from sqlalchemy.orm import Session
from typing import List, Optional
from app.domain.models.egresado import Egresado as EgresadoDomain
from app.domain.interfaces.external.egresado_repository import EgresadoRepository
from app.infrastructure.orm_models.egresado_orm import EgresadoORM


class EgresadoRepositorySQL(EgresadoRepository):
    def __init__(self, db: Session):
        self.db = db

    #Metodos Publicos
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

    def actualizar_egresado(self, egresado: EgresadoDomain) -> EgresadoDomain:
        orm = self.db.query(EgresadoORM).filter(
            EgresadoORM.id == egresado.id).first()
        if orm:
            updated_data = self._to_orm(egresado)
            self._update_fields(orm, updated_data)
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


    #Metodos Privados
    def _update_fields(self, target: EgresadoORM, source: EgresadoORM):
        for field in vars(source):
            if not field.startswith("_") and field != "id":
                setattr(target, field, getattr(source, field))


    def _to_orm(self, egresado: EgresadoDomain) -> EgresadoORM:
        return EgresadoORM(
            id=egresado.id,
            nombres=egresado.nombres,
            apellidos=egresado.apellidos,
            tipoDoc=egresado.tipoDoc,
            numDoc=egresado.numDoc,
            email=egresado.email,
            telefono=egresado.telefono,
            fechaNacimiento=egresado.fechaNacimiento,
            direccion=egresado.direccion,
            nacionalidad=egresado.nacionalidad,
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
            fechaNacimiento=orm.fechaNacimiento,
            direccion=orm.direccion,
            nacionalidad=orm.nacionalidad,
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
