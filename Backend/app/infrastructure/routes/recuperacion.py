from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.infrastructure.database.dependency import get_db
from app.application.services.recuperacion_service import RecuperacionService

router = APIRouter(prefix="/recuperacion", tags=["Recuperacion"])

recuperacion_service = RecuperacionService()

class EmailRequest(BaseModel):
    email: str

@router.post("/solicitar/")
async def solicitar_token(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    return recuperacion_service.generar_token_y_enviar(data["email"], db)

@router.post("/cambiar/")
async def cambiar_password(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    return recuperacion_service.cambiar_contrasena_con_token(data["token"], data["nueva_contrasena"], db)
