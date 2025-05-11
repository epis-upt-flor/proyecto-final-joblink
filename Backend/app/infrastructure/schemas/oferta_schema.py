from pydantic import BaseModel
from datetime import date
from typing import Optional


class OfertaBase(BaseModel):
    titulo: str
    tipo: str
    fecha_cierre: date
    area: str
    modalidad: str
    horario: str
    vacantes: int
    experiencia: str
    locacion: str
    salario: float
    funciones: str
    requisitos: str
    estado: EstadoOferta
    motivo: str
    beneficios: str
    fecha_inicio: date
    tiempo: int
    fecha_publi: date
    estado_publi: EstadoPubli
    id_empresa: int


class OfertaCreate(OfertaBase):
    pass


class OfertaOut(OfertaBase):
    id: int

    class Config:
        orm_mode = True
