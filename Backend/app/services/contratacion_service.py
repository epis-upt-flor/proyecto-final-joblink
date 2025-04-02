from sqlalchemy.orm import Session
from app.models.contrato import Contrato


def registrar_contratacion(db: Session, data: dict):
    contratacion = Contrato(
        egresado_id=data["egresado_id"],
        empresa_id=data["empresa_id"]
    )
    db.add(contratacion)
    db.commit()
    db.refresh(contratacion)
    return contratacion
