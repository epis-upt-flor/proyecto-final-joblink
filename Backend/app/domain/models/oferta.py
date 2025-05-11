from datetime import date
from app.domain.models.enum import EstadoOferta, EstadoPubli


class Oferta:
    def __init__(self, id: int, titulo: str, tipo: str, fecha_cierre: date, area: str, modalidad: str,
                 horario: str, vacantes: int, experiencia: str, locacion: str, salario: float, funciones: str,
                 requisitos: str, estado: EstadoOferta, motivo: str, beneficios: str, fecha_inicio: date,
                 tiempo: int, fecha_publi: date, estado_publi: EstadoPubli, id_empresa: int):
        self.id = id
        self.titulo = titulo
        self.tipo = tipo
        self.fecha_cierre = fecha_cierre
        self.area = area
        self.modalidad = modalidad
        self.horario = horario
        self.vacantes = vacantes
        self.experiencia = experiencia
        self.locacion = locacion
        self.salario = salario
        self.funciones = funciones
        self.requisitos = requisitos
        self.estado = estado
        self.motivo = motivo
        self.beneficios = beneficios
        self.fecha_inicio = fecha_inicio
        self.tiempo = tiempo
        self.fecha_publi = fecha_publi
        self.estado_publi = estado_publi
        self.id_empresa = id_empresa
