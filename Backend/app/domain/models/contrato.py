from datetime import date
from Backend.app.domain.models.enum import EstadoContrato


class Contrato:
    def __init__(self, id: int, id_postulacion: int, fecha_fin: date, estado: EstadoContrato):
        self.id = id
        self.id_postulacion = id_postulacion
        self.fecha_fin = fecha_fin
        self.estado = estado
