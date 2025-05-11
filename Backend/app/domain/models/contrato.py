from datetime import date


class Contrato:
    def __init__(self, id: int, id_postulacion: int, fecha_fin: date, estado: str):
        self.id = id
        self.id_postulacion = id_postulacion
        self.fecha_fin = fecha_fin
        self.estado = estado
