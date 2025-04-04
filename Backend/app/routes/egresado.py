from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services import egresado_service
from app.services.egresado_service import registrar_egresado
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
