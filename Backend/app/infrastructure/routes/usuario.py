from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database.dependency import get_db

router = APIRouter()

@router.get("/usuarios/")
def listar_usuarios(db: Session = Depends(get_db)):
    return listar_usuarios(db)


