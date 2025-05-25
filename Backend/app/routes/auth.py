from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.auth_service import AuthService
from app.observers.bienvenida_observer import BienvenidaObserver

router = APIRouter(prefix="/auth")
auth_service = AuthService()
auth_service.agregar_observer(BienvenidaObserver())

@router.post("/register/")
async def register(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    return auth_service.registrar_usuario(data, db)

@router.post("/login/")
async def login(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    return auth_service.login_usuario(data, db)
