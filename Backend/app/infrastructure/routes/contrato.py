from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.infrastructure.database.dependency import get_db
from app.application.services.contrato_service import registrar_contratacion

router = APIRouter()

@router.post("/contrato/")
async def registrar_contratacion_endpoint(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    contratacion = registrar_contratacion(db, data)
    return {
        "message": "Contratación registrada",
        "id": contratacion.id
    }
