from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.usuario_service import *
from app.services.auth_service import *

router = APIRouter()

@router.get("/usuarios/")
def listar_usuarios(db: Session = Depends(get_db)):
    return listar_usuarios(db)


