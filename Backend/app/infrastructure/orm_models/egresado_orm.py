from sqlalchemy import Column, Integer, String, Date, Boolean, Enum
from app.domain.models.enum import TipoDocumento
from app.infrastructure.database.database_singleton import Base
from sqlalchemy.orm import relationship


class Egresado(Base):
    __tablename__ = "egresado"

    id = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    tipoDoc = Column(Enum(TipoDocumento), nullable=False)
    numDoc = Column(String(15), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefono = Column(String(15), nullable=False)
    direccion = Column(String)
    nacionalidad = Column(String(50))
    fechaNacimiento = Column(Date, nullable=False)
    habilidades = Column(String)
    logrosAcademicos = Column(String)
    certificados = Column(String)
    experienciaLaboral = Column(String)
    idiomas = Column(String)
    linkedin = Column(String)
    github = Column(String)
    cv = Column(String(255))
    disponibilidad = Column(Boolean, default=True)

    postulaciones = relationship("Postulacion", back_populates="egresado")