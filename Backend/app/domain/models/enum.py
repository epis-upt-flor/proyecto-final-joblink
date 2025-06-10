from enum import Enum


class TipoDocumento(str, Enum):
    DNI = "DNI"
    PASAPORTE = "PASAPORTE"
    CARNET_EXT = "CARNET_EXT"


class EstadoOferta(str, Enum):
    ACTIVA = "ACTIVA"
    CERRADA = "CERRADA"
    PENDIENTE = "PENDIENTE"


class EstadoPubli(str, Enum):
    PUBLICADA = "PUBLICADA"
    NO_PUBLICADA = "NO_PUBLICADA"


class EstadoPostulacion(str, Enum):
    RECOMENDADO = "RECOMENDADO"
    POSTULADO = "POSTULADO"
    DESCARTADO = "DESCARTADO"


class EstadoContrato(str, Enum):
    VIGENTE = "VIGENTE"
    TERMINADO = "TERMINADO"
    CANCELADO = "CANCELADO"
