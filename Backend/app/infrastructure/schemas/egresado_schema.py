from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from app.domain.models.egresado import Egresado
from app.domain.models.enum import TipoDocumento


class EgresadoBase(BaseModel):
    nombres: str
    apellidos: str
    tipoDoc: TipoDocumento
    numDoc: str
    email: str
    telefono: str
    fechaNacimiento: date
    direccion: Optional[str] = None
    nacionalidad: Optional[str] = None

    habilidades: Optional[List[str]] = None
    logrosAcademicos: Optional[List[str]] = None
    certificados: Optional[List[str]] = None
    experienciaLaboral: Optional[List[str]] = None
    idiomas: Optional[List[str]] = None

    linkedin: Optional[str] = None
    github: Optional[str] = None
    cv: Optional[str] = None
    disponibilidad: bool = True


class EgresadoCreate(EgresadoBase):
    def to_domain(self) -> Egresado:
        return Egresado(**self.dict())


class EgresadoUpdate(EgresadoBase):
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    tipoDoc: Optional[str] = None
    numDoc: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    fechaNacimiento: Optional[date] = None
    direccion: Optional[str] = None
    nacionalidad: Optional[str] = None
    habilidades: Optional[str] = None
    logrosAcademicos: Optional[str] = None
    certificados: Optional[str] = None
    experienciaLaboral: Optional[str] = None
    idiomas: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    cv: Optional[str] = None
    disponibilidad: Optional[bool] = None

    def to_update_dict(self) -> dict:
        return self.dict(exclude_unset=True)


class EgresadoOut(EgresadoBase):
    id: int

    @classmethod
    def from_domain(cls, egresado: Egresado):
        return cls(
            id=egresado.id,
            nombres=egresado.nombres,
            apellidos=egresado.apellidos,
            tipoDoc=egresado.tipoDoc,
            numDoc=egresado.numDoc,
            email=egresado.email,
            telefono=egresado.telefono,
            fechaNacimiento=egresado.fechaNacimiento,
            direccion=egresado.direccion,
            nacionalidad=egresado.nacionalidad,
            habilidades=egresado.habilidades,
            logrosAcademicos=egresado.logrosAcademicos,
            certificados=egresado.certificados,
            experienciaLaboral=egresado.experienciaLaboral,
            idiomas=egresado.idiomas,
            linkedin=egresado.linkedin,
            github=egresado.github,
            cv=egresado.cv,
            disponibilidad=egresado.disponibilidad
        )
