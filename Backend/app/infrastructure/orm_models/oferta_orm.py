from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, Enum, DECIMAL
from sqlalchemy.orm import relationship
from app.domain.models.enum import EstadoOferta, EstadoPubli
from app.infrastructure.database.database_singleton import Base


class Oferta(Base):
    __tablename__ = "oferta"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(150), nullable=False)
    tipo = Column(String(10), nullable=False)
    fechaCierre = Column(Date, nullable=True)
    area = Column(String(100), nullable=False)
    modalidad = Column(String(50), nullable=False)
    horario = Column(String(50), nullable=False)
    vacantes = Column(Integer, nullable=False)
    experiencia = Column(String(100), nullable=True)
    locacion = Column(String(150), nullable=False)
    salario = Column(DECIMAL(10, 2), nullable=True)
    funciones = Column(Text, nullable=False)
    requisitos = Column(Text, nullable=False)
    estado = Column(Enum(EstadoOferta), nullable=False)
    motivo = Column(Text, nullable=True)
    beneficios = Column(Text, nullable=False)
    fechaInicio = Column(Date, nullable=False)
    tiempo = Column(Integer, nullable=False)
    fechaPubli = Column(Date, nullable=True)
    estadoPubli = Column(Enum(EstadoPubli), nullable=True, default=None)

    idEmpresa = Column(Integer, ForeignKey('empresa.id'), nullable=False)
    empresa = relationship("Empresa", backref="ofertas", uselist=False)

    postulaciones = relationship("Postulacion", back_populates="oferta")
