from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.empresa_service import listar_empresas as listar_empresas_service

router = APIRouter()

@router.get("/empresas/")
def listar_empresas(db: Session = Depends(get_db)):
    empresas = listar_empresas_service(db)
    if not empresas:
        raise HTTPException(status_code=404, detail="No hay empresas registradas.")
    return empresas
