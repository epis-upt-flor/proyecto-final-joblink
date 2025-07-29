from datetime import date
from typing import Any, Dict, Optional, List
from app.domain.models.enum import EstadoOferta, EstadoPubli


class Oferta:
    def __init__(
        self,
        id: Optional[int] = None,
        titulo: str = "",
        tipo: str = "",
        fechaCierre: Optional[date] = None,
        area: str = "",
        modalidad: str = "",
        horario: str = "",
        vacantes: int = 0,
        experiencia: Optional[str] = None,
        locacion: str = "",
        salario: Optional[float] = None,
        funciones: Optional[List[str]] = None,
        requisitos: Optional[List[str]] = None,
        estado: EstadoOferta = EstadoOferta.PENDIENTE,
        motivo: Optional[str] = None,
        beneficios: Optional[List[str]] = None,
        fechaInicio: date = None,
        tiempo: int = 0,
        fechaPubli: Optional[date] = None,
        estadoPubli: Optional[EstadoPubli] = None,
        idEmpresa: int = 0,
        empresa: Optional[Dict[str, Any]] = None
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
        self.empresa = empresa
