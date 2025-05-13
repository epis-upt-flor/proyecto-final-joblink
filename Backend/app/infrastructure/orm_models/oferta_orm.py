from sqlalchemy import Column, Integer, String, Date, DECIMAL, ForeignKey,  JSON
from sqlalchemy.orm import relationship
from app.infrastructure.database.base import Base

class OfertaORM(Base):
    __tablename__ = "ofertas"

    id = Column(Integer, primary_key=True)
    titulo = Column(String(150), nullable=False)
    tipo = Column(String(100), nullable=False)
    fechaCierre = Column(Date)
    area = Column(String(100), nullable=False)
    modalidad = Column(String(50), nullable=False)
    horario = Column(String(50), nullable=False)
    vacantes = Column(Integer, nullable=False)
    experiencia = Column(String(100))
    locacion = Column(String(150), nullable=False)
    salario = Column(DECIMAL(10, 2))
    funciones = Column(JSON)
    requisitos = Column(JSON)
    estado = Column(String, nullable=False)
    motivo = Column(String)
    beneficios = Column(JSON)
    fechaInicio = Column(Date, nullable=False)
    tiempo = Column(Integer, nullable=False)
    fechaPubli = Column(Date)
    estadoPubli = Column(String)

    idEmpresa = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    empresa = relationship("EmpresaORM", back_populates="ofertas")

    postulaciones = relationship("PostulacionORM", back_populates="oferta", cascade="all, delete-orphan")
