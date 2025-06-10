from datetime import date
from typing import Optional
from app.domain.models.enum import EstadoContrato


class Contrato:
    def __init__(
        self,
        id: Optional[int],
        idOfertaEgresado: int,
        fechaFin: date,
        estado: EstadoContrato
    ):
        self.id = id
        self.idOfertaEgresado = idOfertaEgresado
        self.fechaFin = fechaFin
        self.estado = estado
