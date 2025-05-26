from app.domain.interfaces.external.empresa_repository import IEmpresaRepository
from app.domain.models.empresa import Empresa
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException


class EmpresaService:
    def __init__(self, repo: IEmpresaRepository):
        self.repo = repo

    def obtener_todas(self, db: Session) -> List[Empresa]:
        return self.repo.obtener_todas(db)

    def obtener_por_id(self, db: Session, id: int) -> Empresa:
        empresa = self.repo.obtener_por_id(db, id)
        if not empresa:
            raise HTTPException(
                status_code=404, detail="Empresa no encontrada")
        return empresa
