from datetime import date
from typing import Optional

class Egresado:
    def __init__(self, 
                 nombres: str,
                 apellidos: str,
                 tipoDoc: str,
                 numDoc: str,
                 email: str,
                 telefono: str,
                 fechaNacimiento: date,
                 id: Optional[int] = None,
                 direccion: Optional[str] = None,
                 nacionalidad: Optional[str] = None,
                 habilidades: Optional[str] = None,
                 logrosAcademicos: Optional[str] = None,
                 certificados: Optional[str] = None,
                 experienciaLaboral: Optional[str] = None,
                 idiomas: Optional[str] = None,
                 linkedin: Optional[str] = None,
                 github: Optional[str] = None,
                 cv: Optional[str] = None,
                 disponibilidad: bool = True):
        
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
        self.habilidades = habilidades
        self.logrosAcademicos = logrosAcademicos
        self.certificados = certificados
        self.experienciaLaboral = experienciaLaboral
        self.idiomas = idiomas
        self.linkedin = linkedin
        self.github = github
        self.cv = cv
        self.disponibilidad = disponibilidad
