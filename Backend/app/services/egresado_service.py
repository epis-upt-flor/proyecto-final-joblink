import pandas as pd
from sqlalchemy.orm import Session
from app.models.egresado import Egresado
from fastapi import HTTPException
from app.models.enum import TipoDocumento

def registrar_egresado(db: Session, data: dict):
    egresado = Egresado(
        nombres=data["nombres"],
        apellidos=data["apellidos"],
        tipoDoc=TipoDocumento(data["tipoDoc"]),
        numDoc=data["numDoc"],
        email=data["email"],
        telefono=data["telefono"],
        fechaNacimiento=data["fechaNacimiento"]
    )

    db.add(egresado)
    db.commit()
    db.refresh(egresado)
    return egresado
