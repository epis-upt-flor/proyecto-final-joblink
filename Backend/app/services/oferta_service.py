from sqlalchemy.orm import Session
from app.models.oferta import Oferta
from app.models.enum import EstadoOferta, EstadoPubli
from datetime import date


def registrar_oferta(db: Session, data: dict):
    requeridos = ["titulo", "tipo", "area", "modalidad", "horario",
                  "vacantes", "experiencia", "locacion", "funciones", "requisitos",
                  "beneficios", "fechaInicio", "tiempo", "idEmpresa"]

    faltantes = [campo for campo in requeridos if campo not in data]
    if faltantes:
        raise ValueError(f"Faltan campos requeridos: {', '.join(faltantes)}")

    try:
        estado = EstadoOferta[data.get("estado", "pendiente")]
    except KeyError:
        estado = EstadoOferta.pendiente

    estado_publi = None
    try:
        estado_publi = EstadoPubli[data.get("estadoPubli")]
    except (KeyError, TypeError):
        pass

    fecha_publicacion = data.get("fechaPubli") or date.today()

    oferta = Oferta(
        titulo=data["titulo"],
        tipo=data["tipo"],
        fechaCierre=data.get("fechaCierre"),
        area=data["area"],
        modalidad=data["modalidad"],
        horario=data["horario"],
        vacantes=data["vacantes"],
        experiencia=data["experiencia"],
        locacion=data["locacion"],
        salario=data.get("salario"),
        funciones=data["funciones"],
        requisitos=data["requisitos"],
        estado=estado,
        motivo=data.get("motivo"),
        beneficios=data["beneficios"],
        fechaInicio=data["fechaInicio"],
        tiempo=data["tiempo"],
        fechaPubli=fecha_publicacion,
        estadoPubli=estado_publi,
        idEmpresa=data["idEmpresa"]
    )

    db.add(oferta)
    db.commit()
    db.refresh(oferta)
    return oferta


def listar_ofertas(db: Session):
    ofertas = db.query(Oferta).all()
    return [_oferta_to_dict(o) for o in ofertas]


def obtener_oferta_por_id(db: Session, id: int):
    o = db.query(Oferta).filter(Oferta.id == id).first()
    return _oferta_to_dict(o) if o else None


def actualizar_oferta(db: Session, id: int, data: dict):
    oferta = db.query(Oferta).filter(Oferta.id == id).first()
    if not oferta:
        return None

    for key, value in data.items():
        if key == "estado":
            try:
                value = EstadoOferta[value]
            except KeyError:
                continue
        elif key == "estadoPubli":
            try:
                value = EstadoPubli[value]
            except KeyError:
                continue

        if hasattr(oferta, key):
            setattr(oferta, key, value)

    db.commit()
    db.refresh(oferta)
    return oferta


def eliminar_oferta(db: Session, id: int):
    oferta = db.query(Oferta).filter(Oferta.id == id).first()
    if not oferta:
        return False
    db.delete(oferta)
    db.commit()
    return True


def _oferta_to_dict(o: Oferta):
    return {
        "id": o.id,
        "titulo": o.titulo,
        "tipo": o.tipo,
        "fechaCierre": o.fechaCierre.isoformat() if o.fechaCierre else None,
        "area": o.area,
        "modalidad": o.modalidad,
        "horario": o.horario,
        "vacantes": o.vacantes,
        "experiencia": o.experiencia,
        "locacion": o.locacion,
        "salario": float(o.salario) if o.salario else None,
        "funciones": o.funciones,
        "requisitos": o.requisitos,
        "estado": o.estado.name if o.estado else None,
        "motivo": o.motivo,
        "beneficios": o.beneficios,
        "fechaInicio": o.fechaInicio.isoformat() if o.fechaInicio else None,
        "tiempo": o.tiempo,
        "fechaPubli": o.fechaPubli.isoformat() if o.fechaPubli else None,
        "estadoPubli": o.estadoPubli.name if o.estadoPubli else None,
        "idEmpresa": o.idEmpresa
    }
