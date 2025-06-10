from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database.db_session_provider import DBSessionProvider

router = APIRouter()

db_provider = DBSessionProvider()

@router.get("/usuarios/")
def listar_usuarios(db: Session = Depends(db_provider.get_db)):
    return listar_usuarios(db)
