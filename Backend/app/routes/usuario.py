from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.usuario_service import *

router = APIRouter()

@router.get("/usuarios/")
def listar_usuarios(db: Session = Depends(get_db)):
    return listar_usuarios(db)

@router.post("/usuarios/")
async def registrar_usuario_endpoint(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    rol = data.get("rol")
    username = data.get("username")

    if not email or not password or not rol or not username:
        raise HTTPException(status_code=400, detail="Faltan datos obligatorios")

    usuario = registrar_usuario(db, email=email, password=password, rol=rol, username=username)
    return {
        "message": "Usuario registrado con éxito",
        "usuario_id": usuario.id
    }

