from enum import Enum

class EstadoOferta(Enum):
    en_revision = "En revisión"
    aceptada = "Aceptada"
    rechazada = "Rechazada"

class EstadoPubli(Enum):
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
