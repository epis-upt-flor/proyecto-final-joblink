from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.domain.models.oferta import Oferta
from app.domain.models.enum import EstadoOferta, EstadoPubli
from datetime import date


class OfertaService:
    def registrar_oferta(self, db: Session, data: dict) -> Oferta:
        requeridos = ["titulo", "tipo", "area", "modalidad", "horario",
                      "vacantes", "experiencia", "locacion", "funciones", "requisitos",
                      "beneficios", "fechaInicio", "tiempo", "idEmpresa"]

        faltantes = [campo for campo in requeridos if campo not in data]
        if faltantes:
            raise HTTPException(
                status_code=400, detail=f"Faltan campos requeridos: {', '.join(faltantes)}")

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

    def listar_ofertas(self, db: Session) -> list:
        ofertas = db.query(Oferta).all()
        return [self._oferta_to_dict(o) for o in ofertas]

    def obtener_oferta_por_id(self, db: Session, id: int) -> dict | None:
        oferta = db.query(Oferta).filter(Oferta.id == id).first()
        if not oferta:
            return None

        return self._oferta_to_dict(oferta)

    def actualizar_oferta(self, db: Session, id: int, data: dict) -> Oferta | None:
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

    def eliminar_oferta(self, db: Session, id: int) -> bool:
        oferta = db.query(Oferta).filter(Oferta.id == id).first()
        if not oferta:
            return False
        db.delete(oferta)
        db.commit()
        return True

    def _oferta_to_dict(self, o: Oferta) -> dict:
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
