from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.infrastructure.repositories.oferta_repository_sql import OfertaRepositorySQL
from app.application.services.oferta_service import OfertaService
from app.domain.interfaces.internal.oferta_usecase import OfertaUseCase
from app.domain.models.oferta import Oferta as OfertaDomain
from app.infrastructure.repositories.vector_db_repository_upstash import VectorDBRepositoryUpstash

from app.infrastructure.schemas.oferta_schema import (
    OfertaCreate,
    OfertaUpdate,
    OfertaOut,
)

router = APIRouter(prefix="/ofertas", tags=["Ofertas"])
db_provider = DBSessionProvider()


# 💉 Inyección del servicio
def get_oferta_service(db: Session = Depends(db_provider.get_db)) -> OfertaUseCase:
    oferta_repo = OfertaRepositorySQL(db)
    vector_repo = VectorDBRepositoryUpstash()
    return OfertaService(oferta_repo, vector_repo)


@router.post("/", response_model=OfertaOut)
def crear_oferta(
    payload: OfertaCreate,
    service: OfertaUseCase = Depends(get_oferta_service)
):
    oferta_domain = OfertaDomain(**payload.model_dump())
    return service.registrar(oferta_domain)


@router.get("/", response_model=List[OfertaOut])
def listar_ofertas(service: OfertaUseCase = Depends(get_oferta_service)):
    return service.obtener_todos()


@router.get("/{id}", response_model=OfertaOut)
def obtener_oferta(id: int, service: OfertaUseCase = Depends(get_oferta_service)):
    return service.obtener_por_id(id)


@router.put("/{id}", response_model=OfertaOut)
def actualizar_oferta(
    id: int,
    payload: OfertaUpdate,
    service: OfertaUseCase = Depends(get_oferta_service)
):
    return service.actualizar(id, payload)


@router.delete("/{id}", response_model=dict)
def eliminar_oferta(id: int, service: OfertaUseCase = Depends(get_oferta_service)):
    service.eliminar(id)
    return {"mensaje": "Oferta eliminada correctamente"}


@router.patch("/{id}/aprobar/")
def aprobar_oferta(id: int, service: OfertaService = Depends(get_oferta_service)):
    return service.aprobar_oferta(id)


@router.patch("/{id}/rechazar/")
def rechazar_oferta(id: int, payload: dict, service: OfertaService = Depends(get_oferta_service)):
    motivo = payload.get("motivo")
    if not motivo:
        raise HTTPException(
            status_code=400, detail="Motivo de rechazo requerido")
    return service.rechazar_oferta(id, motivo)
