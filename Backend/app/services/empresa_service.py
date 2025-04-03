from sqlalchemy.orm import Session
from app.models.empresa import Empresa

def listar_empresas(db: Session):
    try:
        return db.query(Empresa).all()
    except Exception as e:
        print(f"Error al listar empresas: {e}")
        return []
