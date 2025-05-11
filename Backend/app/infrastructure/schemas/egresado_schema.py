from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from app.domain.models.enum import TipoDocumento


class EgresadoBase(BaseModel):
    nombres: str
    apellidos: str
    tipoDoc: TipoDocumento
    numDoc: str
    email: EmailStr
    telefono: str
    direccion: Optional[str] = None
    nacionalidad: Optional[str] = None
    fechaNacimiento: Optional[date] = None
    habilidades: Optional[str] = None
    logrosAcademicos: Optional[str] = None
    certificados: Optional[str] = None
    experienciaLaboral: Optional[str] = None
    idiomas: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    cv: Optional[str] = None
    disponibilidad: bool = True


class EgresadoCreate(EgresadoBase):
    pass


class EgresadoOut(EgresadoBase):
    id: int

    class Config:
        orm_mode = True
