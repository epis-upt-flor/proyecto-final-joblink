from app.infrastructure.orm_models.empresa_orm import EmpresaORM
from app.domain.models.empresa import Empresa
from app.domain.interfaces.external.empresa_repository import IEmpresaRepository
from sqlalchemy.orm import Session
from typing import List, Optional

class EmpresaRepositorySQL(IEmpresaRepository):

    def __init__(self, db: Session):
        self.db = db

    def obtener_todas(self) -> List[Empresa]:
        return [self._to_domain(e) for e in self.db.query(EmpresaORM).all()]

    def obtener_por_id(self, id: int) -> Optional[Empresa]:
        orm = self.db.query(EmpresaORM).filter(EmpresaORM.id == id).first()
        return self._to_domain(orm) if orm else None

    def _to_domain(self, orm: EmpresaORM) -> Empresa:
        return Empresa(
            id=orm.id,
            nombre=orm.nombre,
            ruc=orm.ruc,
            telefono=orm.telefono,
            logo=orm.logo,
            estado=orm.estado,
        )
