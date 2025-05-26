from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from app.domain.models.enum import EstadoOferta, EstadoPubli

class EmpresaMiniOut(BaseModel):
    id: int
    nombre: str
    logo: Optional[str]

    class Config:
        orm_mode = True

class OfertaCreate(BaseModel):
    titulo: str
    tipo: str
    fechaCierre: Optional[date]
    area: str
    modalidad: str
    horario: str
    vacantes: int
    experiencia: Optional[str]
    locacion: str
    salario: Optional[float]
    funciones: Optional[List[str]]
    requisitos: Optional[List[str]]
    estado: Optional[str] = EstadoOferta.PENDIENTE
    motivo: Optional[str]
    beneficios: Optional[List[str]]
    fechaInicio: date
    tiempo: int
    fechaPubli: Optional[date]
    estadoPubli: Optional[EstadoPubli]
    idEmpresa: int


class OfertaUpdate(BaseModel):
    titulo: Optional[str]
    tipo: Optional[str]
    fechaCierre: Optional[date]
    area: Optional[str]
    modalidad: Optional[str]
    horario: Optional[str]
    vacantes: Optional[int]
    experiencia: Optional[str]
    locacion: Optional[str]
    salario: Optional[float]
    funciones: Optional[List[str]]
    requisitos: Optional[List[str]]
    estado: Optional[EstadoOferta]
    motivo: Optional[str]
    beneficios: Optional[List[str]]
    fechaInicio: Optional[date]
    tiempo: Optional[int]
    fechaPubli: Optional[date]
    estadoPubli: Optional[EstadoPubli]


class OfertaOut(OfertaCreate):
    id: int
    empresa: EmpresaMiniOut

    class Config:
        orm_mode = True

