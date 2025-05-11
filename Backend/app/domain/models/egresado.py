from Backend.app.domain.models.enum import TipoDocumento
import datetime


class Egresado:
    def __init__(self, id: int, nombres: str, apellidos: str, tipoDoc: TipoDocumento, numDoc: str, email: str,
                 telefono: str, direccion: str = None, nacionalidad: str = None, fechaNacimiento: datetime.date = None,
                 habilidades: str = None, logrosAcademicos: str = None, certificados: str = None, 
                 experienciaLaboral: str = None, idiomas: str = None, linkedin: str = None, github: str = None, 
                 cv: str = None, disponibilidad: bool = True):
        self.id = id
        self.nombres = nombres
        self.apellidos = apellidos
        self.tipoDoc = tipoDoc
        self.numDoc = numDoc
        self.email = email
        self.telefono = telefono
        self.direccion = direccion
        self.nacionalidad = nacionalidad
        self.fechaNacimiento = fechaNacimiento
        self.habilidades = habilidades
        self.logrosAcademicos = logrosAcademicos
        self.certificados = certificados
        self.experienciaLaboral = experienciaLaboral
        self.idiomas = idiomas
        self.linkedin = linkedin
        self.github = github
        self.cv = cv
        self.disponibilidad = disponibilidad

    def __repr__(self):
        return f"<Egresado(id={self.id}, nombres={self.nombres}, apellidos={self.apellidos})>"
