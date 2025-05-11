from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.application.services.contrato_service import registrar_contratacion

router = APIRouter()
db_provider = DBSessionProvider()

@router.post("/contrato/")
async def registrar_contratacion_endpoint(request: Request, db: Session = Depends(db_provider.get_db)):
    data = await request.json()
    contratacion = registrar_contratacion(db, data)
    return {
        "message": "Contratación registrada",
        "id": contratacion.id
    }
