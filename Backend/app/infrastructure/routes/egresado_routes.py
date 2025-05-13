from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.domain.interfaces.internal.egresado_usecase import EgresadoUseCase
from app.application.services.egresado_service import EgresadoService
from app.infrastructure.repositories.egresado_repository_sql import EgresadoRepositorySQL
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.infrastructure.schemas.egresado_schema import EgresadoCreate, EgresadoUpdate, EgresadoOut

router = APIRouter(prefix="/egresados", tags=["Egresados"])
db_provider = DBSessionProvider()


def get_egresado_usecase(db: Session = Depends(db_provider.get_db)) -> EgresadoUseCase:
    return EgresadoService(EgresadoRepositorySQL(db))


@router.post("/", response_model=EgresadoOut)
async def registrar_egresado_endpoint(
    egresado: EgresadoCreate,
    service: EgresadoUseCase = Depends(get_egresado_usecase)
):
    egresado_data = service.registrar_egresado(egresado.to_domain())
    return EgresadoOut.from_domain(egresado_data)


@router.get("/", response_model=list[EgresadoOut])
async def obtener_egresados_endpoint(
    service: EgresadoUseCase = Depends(get_egresado_usecase)
):
    egresados = service.obtener_egresados()
    return [EgresadoOut.from_domain(e) for e in egresados]


@router.get("/{id}", response_model=EgresadoOut)
async def obtener_egresado_por_id_endpoint(
    id: int,
    service: EgresadoUseCase = Depends(get_egresado_usecase)
):
    egresado = service.obtener_egresado_por_id(id)
    if not egresado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return EgresadoOut.from_domain(egresado)


@router.put("/{id}", response_model=EgresadoOut)
async def actualizar_egresado_endpoint(
    id: int,
    egresado: EgresadoUpdate,
    service: EgresadoUseCase = Depends(get_egresado_usecase)
):
    egresado_actualizado = service.actualizar_egresado(
        id, egresado.to_update_dict())
    return EgresadoOut.from_domain(egresado_actualizado)


@router.delete("/{id}", response_model=dict)
async def eliminar_egresado_endpoint(
    id: int,
    service: EgresadoUseCase = Depends(get_egresado_usecase)
):
    if not service.eliminar_egresado(id):
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return {"message": "Egresado eliminado correctamente"}
