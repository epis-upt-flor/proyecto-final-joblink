from sqlalchemy import Column, Integer, String, Date, Boolean, JSON
from sqlalchemy.orm import relationship
from app.infrastructure.database.base import Base


class EgresadoORM(Base):
    __tablename__ = "egresados"

    id = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    tipoDoc = Column(String, nullable=False)
    numDoc = Column(String(15), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefono = Column(String(15), nullable=False)
    direccion = Column(String, nullable=True)
    nacionalidad = Column(String(50), nullable=True)
    fechaNacimiento = Column(Date, nullable=False)

    habilidades = Column(JSON, nullable=True)
    logrosAcademicos = Column(JSON, nullable=True)
    certificados = Column(JSON, nullable=True)
    experienciaLaboral = Column(JSON, nullable=True)
    idiomas = Column(JSON, nullable=True)

    linkedin = Column(String, nullable=True)
    github = Column(String, nullable=True)
    cv = Column(String(255), nullable=True)
    disponibilidad = Column(Boolean, default=True)

    postulaciones = relationship(
        "PostulacionORM", back_populates="egresado", cascade="all, delete-orphan")
