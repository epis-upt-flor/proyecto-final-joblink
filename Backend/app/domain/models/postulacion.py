class Postulacion:
    def __init__(self, id: int, id_oferta: int, id_egresado: int, estado: str, posicion_ranking: int = None):
        self.id = id
        self.id_oferta = id_oferta
        self.id_egresado = id_egresado
        self.estado = estado
        self.posicion_ranking = posicion_ranking
