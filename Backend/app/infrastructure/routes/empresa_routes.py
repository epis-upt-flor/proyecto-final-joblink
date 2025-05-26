from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.application.services.empresa_service import EmpresaService
from app.infrastructure.repositories.empresa_repository_sql import EmpresaRepositorySQL
from app.infrastructure.schemas.empresa_schema import EmpresaOut

router = APIRouter(prefix="/empresas", tags=["Empresas"])
db_provider = DBSessionProvider()


def get_empresa_service(db: Session = Depends(db_provider.get_db)):
    repo = EmpresaRepositorySQL()
    return EmpresaService(repo), db


@router.get("/", response_model=List[EmpresaOut])
def listar_empresas(service_db=Depends(get_empresa_service)):
    service, db = service_db
    return service.obtener_todas(db)


@router.get("/{id}", response_model=EmpresaOut)
def obtener_empresa(id: int, service_db=Depends(get_empresa_service)):
    service, db = service_db
    return service.obtener_por_id(db, id)
