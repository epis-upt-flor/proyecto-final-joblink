from sqlalchemy import ForeignKey, Column, Integer, String, Text, Date, Boolean
from app.models.database import Base

class Egresado(Base):
    __tablename__ = "egresados"

    id = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    tipoDoc = Column(Integer, nullable=False)
    numDoc = Column(String(15), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefono = Column(String(15), nullable=False)
    direccion = Column(Text)
    nacionalidad = Column(String(50))
    fechaNaci = Column(Date, nullable=False)
    habilidades = Column(Text)
    logrosAcad = Column(Text)
    certificados = Column(Text)
    expLaboral = Column(Text)
    idiomas = Column(Text)
    linkedin = Column(Text)
    github = Column(Text)
    cv = Column(String(255))
    disponibilidad = Column(Boolean, default=True)
