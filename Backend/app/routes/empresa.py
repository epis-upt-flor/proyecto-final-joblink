from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.empresa_service import crear_empresa, listar_empresas as listar_empresas_service

router = APIRouter()


@router.post("/empresa/")
async def add_empresa(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    empresa = crear_empresa(db, data)
    return {"message": "Empresa agregada", "id": empresa.id}


@router.get("/empresas/")
def listar_empresas(db: Session = Depends(get_db)):
    return listar_empresas_service(db)
