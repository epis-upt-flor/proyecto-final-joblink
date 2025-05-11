from sqlalchemy.orm import Session
from Backend.app.infrastructure.orm_models.contrato_orm import Contrato

def registrar_contratacion(db: Session, data: dict):
    contratacion = Contrato(
        egresado_id=data["egresado_id"],
        empresa_id=data["empresa_id"]
    )
    
    db.add(contratacion)
    db.commit()
    db.refresh(contratacion)
    return contratacion
