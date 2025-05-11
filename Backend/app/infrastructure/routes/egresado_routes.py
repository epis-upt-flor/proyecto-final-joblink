from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.application.services.egresado_service import EgresadoService
from app.infrastructure.repositories.egresado_repository_sql import EgresadoRepositorySQL
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.infrastructure.schemas.egresado_schema import EgresadoCreate, EgresadoUpdate, EgresadoOut

router = APIRouter(prefix="/egresados", tags=["Egresados"])
db_provider = DBSessionProvider()

def get_egresado_service(db: Session = Depends(db_provider.get_db)) -> EgresadoService:
    return EgresadoService(EgresadoRepositorySQL(db))

@router.post("/", response_model=EgresadoOut)
async def registrar_egresado_endpoint(
    egresado: EgresadoCreate,
    service: EgresadoService = Depends(get_egresado_service)
):
    egresado_data = service.registrar_egresado(egresado.dict())
    return egresado_data

@router.get("/", response_model=list[EgresadoOut])
async def obtener_egresados_endpoint(
    service: EgresadoService = Depends(get_egresado_service)
):
    return service.obtener_egresados()

@router.get("/{id}", response_model=EgresadoOut)
async def obtener_egresado_por_id_endpoint(
    id: int,
    service: EgresadoService = Depends(get_egresado_service)
):
    egresado = service.obtener_egresado_por_id(id)
    if not egresado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return egresado

@router.put("/{id}", response_model=EgresadoOut)
async def actualizar_egresado_endpoint(
    id: int,
    egresado: EgresadoUpdate,
    service: EgresadoService = Depends(get_egresado_service)
):
    egresado_data = service.actualizar_egresado(id, egresado.dict())
    if not egresado_data:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return egresado_data

@router.delete("/{id}", response_model=dict)
async def eliminar_egresado_endpoint(
    id: int,
    service: EgresadoService = Depends(get_egresado_service)
):
    if not service.eliminar_egresado(id):
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return {"message": "Egresado eliminado correctamente"}
