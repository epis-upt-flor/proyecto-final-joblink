from sqlalchemy.orm import Session
from app.models.empresa import Empresa

def crear_empresa(db: Session, data: dict) -> Empresa | None:
    try:
        nombre = data.get("nombre")
        ruc = data.get("ruc")
        telefono = data.get("telefono")
        email = data.get("email")

        if not all([nombre, ruc, telefono, email]):
            return None  # Falta información obligatoria

        # Verificar si ya existe la empresa por RUC o email
        empresa_existente = db.query(Empresa).filter((Empresa.ruc == ruc) | (Empresa.email == email)).first()
        if empresa_existente:
            return None  # Empresa ya registrada

        empresa = Empresa(nombre=nombre, ruc=ruc, telefono=telefono, email=email)
        db.add(empresa)
        db.commit()
        db.refresh(empresa)
        return empresa

    except Exception as e:
        db.rollback()
        print(f"Error al crear empresa: {e}")
        return None

def listar_empresas(db: Session):
    try:
        return db.query(Empresa).all()
    except Exception as e:
        print(f"Error al listar empresas: {e}")
        return []
