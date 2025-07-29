from app.domain.interfaces.external.empresa_repository import IEmpresaRepository
from app.domain.models.empresa import Empresa
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException


class EmpresaService:
    def __init__(self, repo: IEmpresaRepository):
        self.repo = repo

    def obtener_todas(self) -> List[Empresa]:
        return self.repo.obtener_todas()

    def obtener_por_id(self, id: int) -> Empresa:
        empresa = self.repo.obtener_por_id(id)
        if not empresa:
            raise HTTPException(
                status_code=404, detail="Empresa no encontrada")
        return empresa
    def editar(self, empresa: Empresa) -> Empresa:
        try:
            empresa_editada = self.repo.editar(empresa)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

        if not empresa_editada:
            raise HTTPException(
                status_code=404,
                detail="Empresa no encontrada"
            )

        return empresa_editada