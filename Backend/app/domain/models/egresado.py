from datetime import date
from typing import Optional, List
from app.domain.models.enum import TipoDocumento


class Egresado:
    def __init__(
        self,
        nombres: str,
        apellidos: str,
        tipoDoc: TipoDocumento,
        numDoc: str,
        email: str,
        telefono: str,
        fechaNacimiento: date,
        id: Optional[int] = None,
        direccion: Optional[str] = None,
        nacionalidad: Optional[str] = None,
        habilidades: Optional[List[str]] = None,
        logrosAcademicos: Optional[List[str]] = None,
        certificados: Optional[List[str]] = None,
        experienciaLaboral: Optional[List[str]] = None,
        idiomas: Optional[List[str]] = None,
        linkedin: Optional[str] = None,
        github: Optional[str] = None,
        cv: Optional[str] = None,
        disponibilidad: bool = True,
    ):
        self.id = id
        self.nombres = nombres
        self.apellidos = apellidos
        self.tipoDoc = tipoDoc
        self.numDoc = numDoc
        self.email = email
        self.telefono = telefono
        self.fechaNacimiento = fechaNacimiento
        self.direccion = direccion
        self.nacionalidad = nacionalidad
        self.habilidades = habilidades or []
        self.logrosAcademicos = logrosAcademicos or []
        self.certificados = certificados or []
        self.experienciaLaboral = experienciaLaboral or []
        self.idiomas = idiomas or []
        self.linkedin = linkedin
        self.github = github
        self.cv = cv
        self.disponibilidad = disponibilidad
