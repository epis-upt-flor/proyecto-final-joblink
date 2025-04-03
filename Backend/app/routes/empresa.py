from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.empresa_service import crear_empresa, listar_empresas as listar_empresas_service

router = APIRouter()

@router.post("/empresa/")
async def add_empresa(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    empresa = crear_empresa(db, data)
    if not empresa:
        raise HTTPException(status_code=400, detail="No se pudo crear la empresa. Verifica los datos.")
    return {"message": "Empresa agregada", "id": empresa.id}

@router.get("/empresas/")
def listar_empresas(db: Session = Depends(get_db)):
    empresas = listar_empresas_service(db)
    if not empresas:
        raise HTTPException(status_code=404, detail="No hay empresas registradas.")
    return empresas
