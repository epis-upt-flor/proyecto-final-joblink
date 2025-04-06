from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.usuario_service import *
from app.services.auth_service import *

router = APIRouter()

@router.get("/usuarios/")
def listar_usuarios(db: Session = Depends(get_db)):
    return listar_usuarios(db)

@router.post("/usuarios/")
async def registrar_usuario_endpoint(request: Request, db: Session = Depends(get_db)):
    data = await request.json()  # Recibimos todo el cuerpo de la solicitud como un diccionario
    
    # Asegurarse de que los datos necesarios estén presentes
    if not data.get("email") or not data.get("password") or not data.get("rol") or not data.get("username"):
        raise HTTPException(status_code=400, detail="Faltan datos obligatorios")

    # Llamar a la función `registrar_usuario` pasando los valores de `data`
    usuario = registrar_usuario(
        data=data, 
        db=db, 
        username=data.get("username"),
        email=data.get("email"),
        password=data.get("password"),
        rol=data.get("rol")
    )  # Pasamos los valores individuales de data
    return {
        "message": "Usuario registrado con éxito",
        "usuario_id": usuario.id
    }