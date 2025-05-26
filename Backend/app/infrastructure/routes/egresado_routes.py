from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.domain.interfaces.internal.egresado_usecase import EgresadoUseCase
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.application.services.egresado_service import EgresadoService
from app.infrastructure.repositories.egresado_repository_sql import EgresadoRepositorySQL
from app.infrastructure.repositories.vector_db_repository_upstash import VectorDBRepositoryUpstash

from app.infrastructure.schemas.egresado_schema import (
    EgresadoCreate,
    EgresadoUpdate,
    EgresadoOut,
)

from app.domain.models.egresado import Egresado

router = APIRouter(prefix="/egresados", tags=["Egresados"])
db_provider = DBSessionProvider()

# 💉 Dependency Injection

def get_service(db: Session = Depends(db_provider.get_db)) -> EgresadoUseCase:
    egresado_repo = EgresadoRepositorySQL(db)
    vector_repo = VectorDBRepositoryUpstash()
    return EgresadoService(egresado_repo, vector_repo)

# 🧠 Rutas

@router.post("/", response_model=EgresadoOut)
def registrar_egresado(
    egresado_in: EgresadoCreate,
    service: EgresadoUseCase = Depends(get_service)
):
    egresado = Egresado(**egresado_in.model_dump())
    return service.registrar_egresado(egresado)


@router.get("/", response_model=List[EgresadoOut])
def obtener_egresados(service: EgresadoUseCase = Depends(get_service)):
    return service.obtener_todos()


@router.get("/{id}", response_model=EgresadoOut)
def obtener_egresado_por_id(id: int, service: EgresadoUseCase = Depends(get_service)):
    return service.obtener_por_id(id)


@router.put("/{id}", response_model=EgresadoOut)
def actualizar_egresado(
    id: int,
    egresado_in: EgresadoUpdate,
    service: EgresadoUseCase = Depends(get_service)
):
    egresado = Egresado(id=id, **egresado_in.model_dump())
    return service.actualizar_egresado(egresado)


@router.delete("/{id}", response_model=dict)
def eliminar_egresado(id: int, service: EgresadoUseCase = Depends(get_service)):
    service.eliminar_egresado(id)
    return {"mensaje": "Egresado eliminado correctamente"}
