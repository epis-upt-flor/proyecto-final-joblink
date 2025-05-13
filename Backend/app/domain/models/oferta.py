from typing import Optional, List
from datetime import date
from app.domain.models.enum import EstadoOferta, EstadoPubli


class Oferta:
    def __init__(
        self,
        id: Optional[int],
        titulo: str,
        tipo: str,
        fechaCierre: Optional[date],
        area: str,
        modalidad: str,
        horario: str,
        vacantes: int,
        experiencia: Optional[str],
        locacion: str,
        salario: Optional[float],
        funciones: List[str],
        requisitos: List[str],
        estado: EstadoOferta,
        motivo: Optional[str],
        beneficios: List[str],
        fechaInicio: date,
        tiempo: int,
        fechaPubli: Optional[date],
        estadoPubli: Optional[EstadoPubli],
        idEmpresa: int
    ):
        self.id = id
        self.titulo = titulo
        self.tipo = tipo
        self.fechaCierre = fechaCierre
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
        self.fechaInicio = fechaInicio
        self.tiempo = tiempo
        self.fechaPubli = fechaPubli
        self.estadoPubli = estadoPubli
        self.idEmpresa = idEmpresa
