from sqlalchemy.orm import Session
from app.models.oferta import Oferta
from app.models.enum import EstadoOferta, EstadoPubli
from datetime import date

def registrar_oferta(db: Session, data: dict):
    try:
        oferta = Oferta(
            titulo=data["titulo"],
            tipo=data["tipo"],
            fechaCierre=data["fechaCierre"],
            area=data["area"],
            modalidad=data["modalidad"],
            horario=data["horario"],
            vacantes=data["vacantes"],
            experiencia=data["experiencia"],
            locacion=data["locacion"],
            salario=data["salario"],
            funciones=data["funciones"],
            requisitos=data["requisitos"],
            estado=EstadoOferta[data["estado"]],
            motivo=data.get("motivo", None),
            beneficios=data["beneficios"],
            fechaInicio=data["fechaInicio"],
            tiempo=data["tiempo"],
            fechaPubli=data.get("fechaPubli", None),
            estadoPubli=EstadoPubli[data["estadoPubli"]] if data.get("estadoPubli") else EstadoPubli.pendiente,
            idEmpresa=data["idEmpresa"]
        )
        db.add(oferta)
        db.commit()
        db.refresh(oferta)
        return oferta
    except Exception as e:
        print(f"Error al registrar oferta: {e}")
        return None
