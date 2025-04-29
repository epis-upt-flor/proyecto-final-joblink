from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.egresado import Egresado
from app.models.enum import TipoDocumento


class EgresadoService:
    def registrar_egresado(self, db: Session, data: dict) -> Egresado:
        requeridos = ["nombres", "apellidos", "tipoDoc",
                      "numDoc", "email", "telefono", "fechaNacimiento"]
        faltantes = [campo for campo in requeridos if campo not in data]
        if faltantes:
            raise HTTPException(
                status_code=400, detail=f"Faltan campos requeridos: {', '.join(faltantes)}")

        if db.query(Egresado).filter(Egresado.numDoc == data["numDoc"]).first():
            raise HTTPException(
                status_code=400, detail="Número de documento ya registrado")

        if db.query(Egresado).filter(Egresado.email == data["email"]).first():
            raise HTTPException(
                status_code=400, detail="Correo ya registrado")

        egresado = Egresado(
            nombres=data["nombres"],
            apellidos=data["apellidos"],
            tipoDoc=TipoDocumento(data["tipoDoc"]),
            numDoc=data["numDoc"],
            email=data["email"],
            telefono=data["telefono"],
            direccion=data.get("direccion"),
            nacionalidad=data.get("nacionalidad"),
            fechaNacimiento=data["fechaNacimiento"],
            habilidades=data.get("habilidades"),
            logrosAcademicos=data.get("logrosAcademicos"),
            certificados=data.get("certificados"),
            experienciaLaboral=data.get("experienciaLaboral"),
            idiomas=data.get("idiomas"),
            linkedin=data.get("linkedin"),
            github=data.get("github"),
            cv=data.get("cv"),
            disponibilidad=data.get("disponibilidad", True),
        )

        db.add(egresado)
        db.commit()
        db.refresh(egresado)
        return egresado

    def obtener_egresados(self, db: Session) -> list:
        egresados = db.query(Egresado).all()
        resultado = []
        for e in egresados:
            resultado.append({
                "id": e.id,
                "nombres": e.nombres,
                "apellidos": e.apellidos,
                "tipoDoc": e.tipoDoc.name if e.tipoDoc else None,
                "numDoc": e.numDoc,
                "email": e.email,
                "telefono": e.telefono,
                "direccion": e.direccion,
                "nacionalidad": e.nacionalidad,
                "fechaNacimiento": e.fechaNacimiento.isoformat() if e.fechaNacimiento else None,
                "habilidades": e.habilidades,
                "logrosAcademicos": e.logrosAcademicos,
                "certificados": e.certificados,
                "experienciaLaboral": e.experienciaLaboral,
                "idiomas": e.idiomas,
                "linkedin": e.linkedin,
                "github": e.github,
                "cv": e.cv,
                "disponibilidad": e.disponibilidad
            })
        return resultado

    def obtener_egresado_por_id(self, db: Session, id: int) -> dict | None:
        e = db.query(Egresado).filter(Egresado.id == id).first()
        if not e:
            return None

        return {
            "id": e.id,
            "nombres": e.nombres,
            "apellidos": e.apellidos,
            "tipoDoc": e.tipoDoc.name if e.tipoDoc else None,
            "numDoc": e.numDoc,
            "email": e.email,
            "telefono": e.telefono,
            "direccion": e.direccion,
            "nacionalidad": e.nacionalidad,
            "fechaNacimiento": e.fechaNacimiento.isoformat() if e.fechaNacimiento else None,
            "habilidades": e.habilidades,
            "logrosAcademicos": e.logrosAcademicos,
            "certificados": e.certificados,
            "experienciaLaboral": e.experienciaLaboral,
            "idiomas": e.idiomas,
            "linkedin": e.linkedin,
            "github": e.github,
            "cv": e.cv,
            "disponibilidad": e.disponibilidad
        }

    def actualizar_egresado(self, db: Session, id: int, data: dict) -> Egresado | None:
        egresado = db.query(Egresado).filter(Egresado.id == id).first()
        if not egresado:
            return None

        for key, value in data.items():
            if key == "tipoDoc":
                try:
                    value = TipoDocumento(value)
                except ValueError:
                    continue

            if hasattr(egresado, key):
                setattr(egresado, key, value)

        db.commit()
        db.refresh(egresado)
        return egresado

    def eliminar_egresado(self, db: Session, id: int) -> bool:
        egresado = db.query(Egresado).filter(Egresado.id == id).first()
        if not egresado:
            return False

        db.delete(egresado)
        db.commit()
        return True
