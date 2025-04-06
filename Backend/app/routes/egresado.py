from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.egresado_service import (
    registrar_egresado,
    obtener_egresados,
    obtener_egresado_por_id_service,
    actualizar_egresado_service,
    eliminar_egresado_service
)

router = APIRouter(prefix="/egresados", tags=["Egresados"])


@router.post("/")
async def registrar_egresado_endpoint(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    egresado = registrar_egresado(db, data)
    return {"message": "Egresado registrado correctamente", "id": egresado.id}


@router.get("/")
async def listar_egresados_endpoint(db: Session = Depends(get_db)):
    return obtener_egresados(db)


@router.get("/{id}")
async def obtener_egresado_endpoint(id: int, db: Session = Depends(get_db)):
    egresado = obtener_egresado_por_id_service(db, id)
    if not egresado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return egresado


@router.put("/{id}")
async def editar_egresado_endpoint(id: int, request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    egresado_actualizado = actualizar_egresado_service(db, id, data)
    if not egresado_actualizado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return {"message": "Egresado actualizado correctamente", "id": egresado_actualizado.id}


@router.delete("/{id}")
async def eliminar_egresado_endpoint(id: int, db: Session = Depends(get_db)):
    eliminado = eliminar_egresado_service(db, id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    return {"message": "Egresado eliminado correctamente"}
