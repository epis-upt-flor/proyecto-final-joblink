from datetime import date
from typing import Optional
from app.domain.models.enum import EstadoPostulacion


class Postulacion:
    def __init__(
        self,
        id: Optional[int],
        idOferta: int,
        idEgresado: int,
        fechaRecomendacion: date,
        posicionRanking: int,
        estado: EstadoPostulacion
    ):
        self.id = id
        self.idOferta = idOferta
        self.idEgresado = idEgresado
        self.fechaRecomendacion = fechaRecomendacion
        self.posicionRanking = posicionRanking
        self.estado = estado
