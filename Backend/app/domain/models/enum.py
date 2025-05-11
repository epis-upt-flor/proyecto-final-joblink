from enum import Enum


class EstadoPubli(Enum):
    en_revision = "En revisión"
    aceptada = "Aceptada"
    rechazada = "Rechazada"

class EstadoOferta(Enum):
    pendiente = "Pendiente"
    abierta = "Abierta"
    cerrada = "Cerrada"

class EstadoPostulacion(Enum):
    en_revision = "En revisión"
    aceptada = "Aceptada"
    rechazada = "Rechazada"

class EstadoContrato(Enum):
    iniciado = "Iniciado"
    finalizado = "Finalizado"

class TipoDocumento(Enum):
    dni = "DNI"
    carnet_extranjeria = "Carnet de Extranjería"
