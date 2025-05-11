from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.infrastructure.database.dependency import get_db
from app.application.services.empresa_service import EmpresaService

router = APIRouter(prefix="/empresas", tags=["Empresas"])
empresa_service = EmpresaService()

@router.get("/")
def listar_empresas_endpoint(db: Session = Depends(get_db)):
    empresas = empresa_service.listar_empresas(db)
    if not empresas:
        raise HTTPException(status_code=404, detail="No hay empresas registradas.")
    return empresas

@router.delete("/{empresa_id}")
def eliminar_empresa_endpoint(empresa_id: int, db: Session = Depends(get_db)):
    return empresa_service.eliminar_empresa(db, empresa_id)

@router.put("/{empresa_id}")
async def editar_empresa_endpoint(empresa_id: int, request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    nombre = data.get("nombre")
    ruc = data.get("ruc")
    telefono = data.get("telefono")
    logo = data.get("logo")

    empresa = empresa_service.editar_empresa(db, empresa_id, nombre, ruc, telefono, logo)
    return {
        "message": "Empresa actualizada correctamente.",
        "empresa_id": empresa.id
    }
