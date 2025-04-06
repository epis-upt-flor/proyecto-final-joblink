from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.empresa import Empresa
from app.models.usuario import Usuario

def listar_empresas(db: Session):
    try:
        return db.query(Empresa).all()
    except Exception as e:
        print(f"Error al listar empresas: {e}")
        return []

def eliminar_empresa(db: Session, empresa_id: int):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada.")

    # Elimina primero de Empresa, luego de Usuario
    db.delete(empresa)
    db.commit()

    usuario = db.query(Usuario).filter(Usuario.id == empresa_id).first()
    if usuario:
        db.delete(usuario)
        db.commit()

    return True

def editar_empresa(db: Session, empresa_id: int, nombre: str, ruc: str, telefono: str, logo: str):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()

    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    empresa.nombre = nombre
    empresa.ruc = ruc
    empresa.telefono = telefono
    empresa.logo = logo

    db.commit()
    db.refresh(empresa)

    return empresa
