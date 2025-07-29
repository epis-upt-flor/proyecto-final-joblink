from app.infrastructure.orm_models.empresa_orm import EmpresaORM
from app.domain.models.empresa import Empresa
from app.domain.interfaces.external.empresa_repository import IEmpresaRepository
from sqlalchemy.orm import Session
from typing import List, Optional, Dict

class EmpresaRepositorySQL(IEmpresaRepository):

    def __init__(self, db: Session):
        self.db = db

    def obtener_todas(self) -> List[Empresa]:
        return [self._to_domain(e) for e in self.db.query(EmpresaORM).all()]

    def obtener_por_id(self, id: int) -> Optional[Empresa]:
        orm = self.db.query(EmpresaORM).filter(EmpresaORM.id == id).first()
        return self._to_domain(orm) if orm else None

    def editar(self, empresa: Empresa) -> Optional[Empresa]:
        orm = self.db.query(EmpresaORM).filter(EmpresaORM.id == empresa.id).first()
        if not orm:
            return None

        ruc_existente = (
            self.db.query(EmpresaORM)
            .filter(EmpresaORM.ruc == empresa.ruc, EmpresaORM.id != empresa.id)
            .first()
        )
        if ruc_existente:
            raise ValueError("El RUC ya está registrado por otra empresa.")

        orm.nombre = empresa.nombre
        orm.ruc = empresa.ruc
        orm.telefono = empresa.telefono
        orm.logo = empresa.logo
        orm.estado = empresa.estado

        self.db.commit()
        self.db.refresh(orm)

        return self._to_domain(orm)

    def obtener_nombres_por_ids(self, ids: List[int]) -> List[Dict]:
        empresas = (
            self.db.query(EmpresaORM.id, EmpresaORM.nombre)
            .filter(EmpresaORM.id.in_(ids))
            .all()
        )
        return [{"id": e.id, "nombre": e.nombre} for e in empresas]
    
    def _to_domain(self, orm: EmpresaORM) -> Empresa:
        return Empresa(
            id=orm.id,
            nombre=orm.nombre,
            ruc=orm.ruc,
            telefono=orm.telefono,
            logo=orm.logo,
            estado=orm.estado,
        )
