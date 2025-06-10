from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.domain.models.enum import EstadoContrato
from app.domain.models.contrato import Contrato


class ContratoBase(BaseModel):
    idOfertaEgresado: int
    fechaFin: date
    estado: EstadoContrato


class ContratoCreate(ContratoBase):
    def to_domain(self) -> Contrato:
        return Contrato(id=None, **self.dict())


class ContratoUpdate(BaseModel):
    fechaFin: Optional[date] = None
    estado: Optional[EstadoContrato] = None

    def to_update_dict(self) -> dict:
        return self.dict(exclude_unset=True)


class ContratoOut(ContratoBase):
    id: int

    @classmethod
    def from_domain(cls, contrato: Contrato):
        return cls(**contrato.__dict__)

    class Config:
        from_attributes = True
