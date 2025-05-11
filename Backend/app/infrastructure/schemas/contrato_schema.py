from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.domain.models.enum import EstadoContrato


class ContratoBase(BaseModel):
    id_postulacion: int
    fecha_fin: date
    estado: EstadoContrato


class ContratoCreate(ContratoBase):
    pass


class ContratoOut(ContratoBase):
    id: int

    class Config:
        orm_mode = True
