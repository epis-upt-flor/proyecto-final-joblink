from pydantic import BaseModel
from datetime import date
from typing import Optional

class EgresadoBase(BaseModel):
    nombres: str
    apellidos: str
    tipoDoc: str
    numDoc: str
    email: str
    telefono: str
    fechaNacimiento: date
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
    disponibilidad: bool = True

class EgresadoCreate(EgresadoBase):
    pass

class EgresadoUpdate(EgresadoBase):
    pass

class EgresadoOut(EgresadoBase):
    id: int

    class Config:
        orm_mode = True
