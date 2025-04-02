from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.contratacion_service import registrar_contratacion

router = APIRouter()


@router.post("/contratacion/")
async def registrar_contratacion_endpoint(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    contratacion = registrar_contratacion(db, data)
    return {
        "message": "Contratación registrada",
        "id": contratacion.id
    }
