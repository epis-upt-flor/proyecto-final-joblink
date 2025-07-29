from fastapi import APIRouter, Body, Depends
from typing import List
from app.domain.models.empresa import Empresa
from sqlalchemy.orm import Session
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.application.services.empresa_service import EmpresaService
from app.infrastructure.repositories.empresa_repository_sql import EmpresaRepositorySQL
from app.infrastructure.schemas.empresa_schema import EmpresaIn, EmpresaOut

router = APIRouter(prefix="/empresas", tags=["Empresas"])
db_provider = DBSessionProvider()


def get_empresa_service(db: Session = Depends(db_provider.get_db)):
    repo = EmpresaRepositorySQL(db)
    return EmpresaService(repo)


@router.get("/", response_model=List[EmpresaOut])
def listar_empresas(service=Depends(get_empresa_service)):
    return service.obtener_todas()


@router.get("/{id}", response_model=EmpresaOut)
def obtener_empresa(id: int, service=Depends(get_empresa_service)):
    return service.obtener_por_id(id)

@router.put("/{id}", response_model=EmpresaOut)
def editar_empresa(id: int, data: EmpresaIn = Body(...), service=Depends(get_empresa_service)):
    empresa = Empresa(
        id=id,
        nombre=data.nombre,
        ruc=data.ruc,
        telefono=data.telefono,
        logo=data.logo,
        estado=data.estado
    )
    return service.editar(empresa)