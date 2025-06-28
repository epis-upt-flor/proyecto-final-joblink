from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, List
from app.domain.models.egresado import Egresado
class Idioma(BaseModel):
    idioma: str
    nivel: str


class Experiencia(BaseModel):
    empresa: str
    puesto: str
    periodo: str
    responsabilidades: List[str]

class EgresadoBase(BaseModel):
    nombres: str
    apellidos: str
    tipoDoc: str
    numDoc: str
    email: EmailStr
    telefono: str
    fechaNacimiento: date
    direccion: Optional[str] = None
    nacionalidad: Optional[str] = None
    habilidades: Optional[List[str]] = []
    logrosAcademicos: Optional[List[str]] = []
    certificados: Optional[List[str]] = []
    experienciaLaboral: Optional[List[Experiencia]] = []
    idiomas: Optional[List[Idioma]] = []
    linkedin: Optional[str] = None
    github: Optional[str] = None
    cv: Optional[str] = None
    disponibilidad: bool = True



class EgresadoCreate(EgresadoBase):
    def to_domain(self) -> Egresado:
        return Egresado(id=None, **self.dict())


class EgresadoUpdate(BaseModel):
    apellidos: Optional[str] = None
    tipoDoc: Optional[str] = None
    numDoc: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    fechaNacimiento: Optional[date] = None
    direccion: Optional[str] = None
    nacionalidad: Optional[str] = None
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
        return cls(**egresado.__dict__)

    class Config:
        from_attributes = True
