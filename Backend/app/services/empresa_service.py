from sqlalchemy.orm import Session
from app.models.empresa import Empresa

def crear_empresa(db: Session, data: dict) -> Empresa:
    empresa = Empresa(
        nombre=data["nombre"],
        ruc=data["ruc"],
        telefono=data["telefono"],
        email=data["email"]
    )
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa

def listar_empresas(db: Session):
    return db.query(Empresa).all()
