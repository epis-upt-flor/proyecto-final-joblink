from app.domain.interfaces.OUT.egresado_repository import EgresadoRepository
from app.infrastructure.orm_models.egresado_orm import Egresado as EgresadoORM
from app.domain.models.egresado import Egresado
from sqlalchemy.orm import Session

class EgresadoRepositorySQL(EgresadoRepository):
    def __init__(self, db: Session):
        self.db = db

    def registrar_egresado(self, egresado: Egresado) -> Egresado:
        egresado_orm = EgresadoORM(
            nombres=egresado.nombres,
            apellidos=egresado.apellidos,
            tipoDoc=egresado.tipoDoc,
            numDoc=egresado.numDoc,
            email=egresado.email,
            telefono=egresado.telefono,
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
        self.db.add(egresado_orm)
        self.db.commit()
        self.db.refresh(egresado_orm)
        return self._map_to_domain(egresado_orm)

    def obtener_egresados(self) -> list:
        egresados_orm = self.db.query(EgresadoORM).all()
        egresados = []

        for egresado in egresados_orm:
            egresado_dict = egresado.__dict__.copy()
            egresado_dict.pop('_sa_instance_state', None)
            egresado_dict['tipoDoc'] = str(egresado.tipoDoc)
            egresados.append(Egresado(**egresado_dict))

        return egresados

    def obtener_egresado_por_id(self, id: int) -> Egresado | None:
        egresado_orm = self.db.query(EgresadoORM).filter(EgresadoORM.id == id).first()
        if not egresado_orm:
            return None
        return self._map_to_domain(egresado_orm)

    def actualizar_egresado(self, egresado: Egresado) -> Egresado | None:
        egresado_orm = self.db.query(EgresadoORM).filter(EgresadoORM.id == egresado.id).first()
        if not egresado_orm:
            return None

        egresado_orm.nombres = egresado.nombres
        egresado_orm.apellidos = egresado.apellidos
        egresado_orm.tipoDoc = egresado.tipoDoc
        egresado_orm.numDoc = egresado.numDoc
        egresado_orm.email = egresado.email
        egresado_orm.telefono = egresado.telefono
        egresado_orm.fechaNacimiento = egresado.fechaNacimiento
        egresado_orm.habilidades = egresado.habilidades
        egresado_orm.logrosAcademicos = egresado.logrosAcademicos
        egresado_orm.certificados = egresado.certificados
        egresado_orm.experienciaLaboral = egresado.experienciaLaboral
        egresado_orm.idiomas = egresado.idiomas
        egresado_orm.linkedin = egresado.linkedin
        egresado_orm.github = egresado.github
        egresado_orm.cv = egresado.cv
        egresado_orm.disponibilidad = egresado.disponibilidad

        self.db.commit()
        self.db.refresh(egresado_orm)
        return self._map_to_domain(egresado_orm)

    def eliminar_egresado(self, id: int) -> bool:
        egresado_orm = self.db.query(EgresadoORM).filter(EgresadoORM.id == id).first()
        if not egresado_orm:
            return False
        self.db.delete(egresado_orm)
        self.db.commit()
        return True

    def _map_to_domain(self, egresado_orm: EgresadoORM) -> Egresado:
        return Egresado(
            id=egresado_orm.id,
            nombres=egresado_orm.nombres,
            apellidos=egresado_orm.apellidos,
            tipoDoc=egresado_orm.tipoDoc,
            numDoc=egresado_orm.numDoc,
            email=egresado_orm.email,
            telefono=egresado_orm.telefono,
            fechaNacimiento=egresado_orm.fechaNacimiento,
            habilidades=egresado_orm.habilidades,
            logrosAcademicos=egresado_orm.logrosAcademicos,
            certificados=egresado_orm.certificados,
            experienciaLaboral=egresado_orm.experienciaLaboral,
            idiomas=egresado_orm.idiomas,
            linkedin=egresado_orm.linkedin,
            github=egresado_orm.github,
            cv=egresado_orm.cv,
            disponibilidad=egresado_orm.disponibilidad
        )
