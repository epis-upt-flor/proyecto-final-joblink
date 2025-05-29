from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.application.services.contrato_service import ContratoService
from app.domain.interfaces.internal.contrato_usecase import ContratoUseCase
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.infrastructure.repositories.contrato_repository_sql import ContratoRepositorySQL
from app.infrastructure.repositories.postulacion_repository_sql import PostulacionRepositorySQL
from app.application.services.postulacion_service import PostulacionService

from app.infrastructure.schemas.postulacion_schema import (
    PostulacionCreate,
    PostulacionUpdate,
    PostulacionOut,
    PostulacionConEgresadoOut
)

from app.domain.models.postulacion import Postulacion
from app.domain.interfaces.internal.postulacion_usecase import PostulacionUseCase

router = APIRouter(prefix="/postulaciones", tags=["Postulaciones"])
db_provider = DBSessionProvider()

# 💉 Dependency Injection


def get_contrato_service(db: Session = Depends(db_provider.get_db)) -> ContratoUseCase:
    repo = ContratoRepositorySQL(db)
    return ContratoService(repo)


def get_service(
    db: Session = Depends(db_provider.get_db),
    contrato_service: ContratoUseCase = Depends(get_contrato_service)
) -> PostulacionUseCase:
    repo = PostulacionRepositorySQL(db)
    return PostulacionService(repo, contrato_service)


@router.post("/", response_model=PostulacionOut)
def registrar_postulacion(
    postulacion_in: PostulacionCreate,
    service: PostulacionUseCase = Depends(get_service)
):
    postulacion = postulacion_in.to_domain()
    return service.registrar_postulacion(postulacion)


@router.get("/", response_model=List[PostulacionOut])
def obtener_postulaciones(service: PostulacionUseCase = Depends(get_service)):
    return [PostulacionOut.from_domain(p) for p in service.obtener_todas()]


@router.get("/{id}", response_model=PostulacionOut)
def obtener_postulacion_por_id(id: int, service: PostulacionUseCase = Depends(get_service)):
    postulacion = service.obtener_por_id(id)
    return PostulacionOut.from_domain(postulacion)


@router.put("/{id}", response_model=PostulacionOut)
def actualizar_postulacion(
    id: int,
    postulacion_in: PostulacionUpdate,
    service: PostulacionUseCase = Depends(get_service)
):
    postulacion_db = service.obtener_por_id(id)
    datos_actualizados = postulacion_in.to_update_dict()
    for key, value in datos_actualizados.items():
        setattr(postulacion_db, key, value)
    return service.actualizar_postulacion(postulacion_db)


@router.delete("/{id}", response_model=dict)
def eliminar_postulacion(id: int, service: PostulacionUseCase = Depends(get_service)):
    service.eliminar_postulacion(id)
    return {"mensaje": "Postulación eliminada correctamente"}


@router.post("/{id}/aprobar", response_model=PostulacionOut)
def aprobar_postulacion(id: int, service: PostulacionUseCase = Depends(get_service)):
    postulacion = service.aprobar_postulacion(id)
    return PostulacionOut.from_domain(postulacion)


@router.post("/{id}/rechazar", response_model=PostulacionOut)
def rechazar_postulacion(id: int, service: PostulacionUseCase = Depends(get_service)):
    postulacion = service.rechazar_postulacion(id)
    return PostulacionOut.from_domain(postulacion)


@router.get("/oferta/{id_oferta}", response_model=List[PostulacionConEgresadoOut])
def obtener_postulaciones_por_oferta(id_oferta: int, service: PostulacionUseCase = Depends(get_service)):
    return service.obtener_por_oferta(id_oferta)


@router.get("/empresa/{id_empresa}", response_model=List[PostulacionOut])
def obtener_postulaciones_por_empresa(id_empresa: int, service: PostulacionUseCase = Depends(get_service)):
    postulaciones = service.obtener_por_empresa(id_empresa)
    return [PostulacionOut.from_domain(p) for p in postulaciones]
