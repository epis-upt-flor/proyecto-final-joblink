from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.usuario_service import crear_usuario, listar_usuarios as listar_usuarios_service

router = APIRouter()

@router.post("/usuario/")
async def add_usuario(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    usuario = crear_usuario(db, data)
    return {"message": "Usuario agregado", "id": usuario.id}

@router.get("/usuarios/")
def listar_usuarios(db: Session = Depends(get_db)):
    return listar_usuarios_service(db)
