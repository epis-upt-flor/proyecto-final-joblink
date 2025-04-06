from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.empresa_service import *

router = APIRouter()

@router.get("/empresas/")
def listar_empresas(db: Session = Depends(get_db)):
    empresas = listar_empresas(db)
    if not empresas:
        raise HTTPException(status_code=404, detail="No hay empresas registradas.")
    return empresas

@router.delete("/empresas/{empresa_id}")
def eliminar_empresa_endpoint(empresa_id: int, db: Session = Depends(get_db)):
    eliminar_empresa(db, empresa_id)
    return {"message": "Empresa eliminada correctamente."}

@router.put("/empresas/{empresa_id}")
async def editar_empresa_endpoint(empresa_id: int, request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    nombre = data.get("nombre")
    ruc = data.get("ruc")
    telefono = data.get("telefono")
    logo = data.get("logo")

    empresa = editar_empresa(db, empresa_id, nombre, ruc, telefono, logo)
    return {
        "message": "Empresa actualizada correctamente.",
        "empresa_id": empresa.id
    }
