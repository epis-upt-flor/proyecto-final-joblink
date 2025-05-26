from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.domain.models.enum import EstadoPostulacion
from app.domain.models.postulacion import Postulacion


class PostulacionBase(BaseModel):
    idOferta: int
    idEgresado: int
    fechaRecomendacion: date
    posicionRanking: int
    estado: EstadoPostulacion


class PostulacionCreate(PostulacionBase):
    def to_domain(self) -> Postulacion:
        return Postulacion(id=None, **self.dict())


class PostulacionUpdate(BaseModel):
    fechaRecomendacion: Optional[date] = None
    posicionRanking: Optional[int] = None
    estado: Optional[EstadoPostulacion] = None

    def to_update_dict(self) -> dict:
        return self.dict(exclude_unset=True)


class PostulacionOut(PostulacionBase):
    id: int

    @classmethod
    def from_domain(cls, postulacion: Postulacion):
        return cls(**postulacion.__dict__)

    class Config:
        from_attributes = True
