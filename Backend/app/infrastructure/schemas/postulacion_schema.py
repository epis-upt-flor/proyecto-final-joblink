from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PostulacionBase(BaseModel):
    id_oferta: int
    id_egresado: int
    estado: EstadoPostulacion
    posicion_ranking: Optional[int] = None


class PostulacionCreate(PostulacionBase):
    pass


class PostulacionOut(PostulacionBase):
    id: int
    fecha_recomendacion: datetime

    class Config:
        orm_mode = True
