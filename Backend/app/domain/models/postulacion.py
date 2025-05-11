from Backend.app.domain.models.enum import EstadoPostulacion


class Postulacion:
    def __init__(self, id: int, id_oferta: int, id_egresado: int, estado: EstadoPostulacion, posicion_ranking: int = None):
        self.id = id
        self.id_oferta = id_oferta
        self.id_egresado = id_egresado
        self.estado = estado
        self.posicion_ranking = posicion_ranking
