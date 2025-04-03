from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.auth_service import registrar_usuario, login_usuario

router = APIRouter(prefix="/auth")

@router.post("/register/")
async def register(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    return registrar_usuario(data, db)

@router.post("/login/")
async def login(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    return login_usuario(data, db)
