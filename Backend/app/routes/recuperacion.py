from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from pydantic import BaseModel
from app.services.recuperacion_service import generar_token_y_enviar, cambiar_contrasena_con_token

router = APIRouter(prefix="/recuperacion")
class EmailRequest(BaseModel):
    email: str

@router.post("/solicitar/")
async def solicitar_token(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    print(data)
    return generar_token_y_enviar(data["email"], db)

@router.post("/cambiar/")
async def cambiar_password(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    return cambiar_contrasena_con_token(data["token"], data["nueva_contrasena"], db)
