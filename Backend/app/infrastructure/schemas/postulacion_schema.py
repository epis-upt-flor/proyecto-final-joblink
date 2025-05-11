from pydantic import BaseModel
from typing import Optional


class PostulacionBase(BaseModel):
    id_oferta: int
    id_egresado: int
    estado: EstadoPostulacion
    posicion_ranking: Optional[int] = None


class PostulacionCreate(PostulacionBase):
    pass


class PostulacionOut(PostulacionBase):
    id: int

    class Config:
        orm_mode = True
