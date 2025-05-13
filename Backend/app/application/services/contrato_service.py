from sqlalchemy.orm import Session
from app.infrastructure.orm_models.contrato_orm import ContratoORM

def registrar_contratacion(db: Session, data: dict):
    contratacion = ContratoORM(
        egresado_id=data["egresado_id"],
        empresa_id=data["empresa_id"]
    )
    
    db.add(contratacion)
    db.commit()
    db.refresh(contratacion)
    return contratacion
