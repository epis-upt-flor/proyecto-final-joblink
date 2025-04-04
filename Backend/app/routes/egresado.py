from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services import egresado_service
from app.services.egresado_service import *
from typing import List

router = APIRouter(prefix="/egresados", tags=["Egresados"])


@router.post("/")
async def registrar_egresado_endpoint(request: Request, db: Session = Depends(get_db)):
    data = await request.json()  # Recibimos el cuerpo de la solicitud
    egresado = registrar_egresado(db, data)  # Llamamos al servicio para registrar
    return {
        "message": "Egresado registrado",
        "id": egresado.id
    }

@router.get("/")
async def listar_egresados(db: Session = Depends(get_db)):
    egresados = egresado_service.obtener_egresados(db)
    return egresados

@router.put("/{id}")
async def editar_egresado(id: int, request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    egresado_actualizado = actualizar_egresado_service(db, id, data)
    
    if not egresado_actualizado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")
    
    return {
        "message": "Egresado actualizado",
        "id": egresado_actualizado.id
    }
