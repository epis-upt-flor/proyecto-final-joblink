from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.infrastructure.repositories.contrato_repository_sql import ContratoRepositorySQL
from app.application.services.contrato_service import ContratoService

from app.infrastructure.schemas.contrato_schema import (
    ContratoCreate,
    ContratoUpdate,
    ContratoOut,
)
from app.domain.models.contrato import Contrato
from app.domain.interfaces.internal.contrato_usecase import ContratoUseCase

router = APIRouter(prefix="/contratos", tags=["Contratos"])
db_provider = DBSessionProvider()

# 💉 Dependency Injection


def get_service(db: Session = Depends(db_provider.get_db)) -> ContratoUseCase:
    repo = ContratoRepositorySQL(db)
    return ContratoService(repo)


@router.post("/", response_model=ContratoOut)
def registrar_contrato(
    contrato_in: ContratoCreate,
    service: ContratoUseCase = Depends(get_service)
):
    contrato = contrato_in.to_domain()
    return service.registrar_contrato(contrato)


@router.get("/", response_model=List[ContratoOut])
def obtener_contratos(service: ContratoUseCase = Depends(get_service)):
    return [ContratoOut.from_domain(c) for c in service.obtener_todos()]


@router.get("/{id}", response_model=ContratoOut)
def obtener_contrato_por_id(id: int, service: ContratoUseCase = Depends(get_service)):
    contrato = service.obtener_por_id(id)
    return ContratoOut.from_domain(contrato)


@router.put("/{id}", response_model=ContratoOut)
def actualizar_contrato(
    id: int,
    contrato_in: ContratoUpdate,
    service: ContratoUseCase = Depends(get_service)
):
    contrato_db = service.obtener_por_id(id)
    datos_actualizados = contrato_in.to_update_dict()
    for key, value in datos_actualizados.items():
        setattr(contrato_db, key, value)
    return service.actualizar_contrato(contrato_db)


@router.delete("/{id}", response_model=dict)
def eliminar_contrato(id: int, service: ContratoUseCase = Depends(get_service)):
    service.eliminar_contrato(id)
    return {"mensaje": "Contrato eliminado correctamente"}
