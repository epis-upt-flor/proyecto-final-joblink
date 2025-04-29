from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.egresado_service import EgresadoService

router = APIRouter(prefix="/egresados", tags=["Egresados"])
egresado_service = EgresadoService()

@router.post("/")
async def registrar_egresado_endpoint(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    egresado = egresado_service.registrar_egresado(db, data)
    return {"message": "Egresado registrado correctamente", "id": egresado.id}

@router.get("/")
async def listar_egresados_endpoint(db: Session = Depends(get_db)):
    return egresado_service.obtener_egresados(db)

@router.get("/{id}")
async def obtener_egresado_endpoint(id: int, db: Session = Depends(get_db)):
    egresado = egresado_service.obtener_egresado_por_id(db, id)
    if not egresado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return egresado

@router.put("/{id}")
async def editar_egresado_endpoint(id: int, request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    egresado_actualizado = egresado_service.actualizar_egresado(db, id, data)
    if not egresado_actualizado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return {"message": "Egresado actualizado correctamente", "id": egresado_actualizado.id}

@router.delete("/{id}")
async def eliminar_egresado_endpoint(id: int, db: Session = Depends(get_db)):
    eliminado = egresado_service.eliminar_egresado(db, id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return {"message": "Egresado eliminado correctamente"}
