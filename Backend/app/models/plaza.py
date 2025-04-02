from sqlalchemy import ForeignKey, Column, Integer, String, Date, Text, Enum, DECIMAL, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ENUM
from app.models.database import Base

class Plaza(Base):
    __tablename__ = "plazas"

    id = Column(Integer, primary_key=True, index=True)
    idEmpresa = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    titulo = Column(String(150), nullable=False)
    tipo = Column(Enum('Empleo', 'Práctica', name='tipo_plaza'), nullable=False)
    fechaCierre = Column(Date, nullable=False)
    area = Column(String(100), nullable=False)
    modalidad = Column(String(50), nullable=False)
    horario = Column(String(50), nullable=False)
    vacantes = Column(Integer, nullable=False)
    experiencia = Column(Boolean, nullable=False)
    locacion = Column(String(150), nullable=False)
    salario = Column(DECIMAL(10, 2), nullable=True)
    funciones = Column(Text, nullable=False)
    requisitos = Column(Text, nullable=False)
    estado = Column(Enum('En revisión', 'Aceptada', 'Rechazada', name='estado_plaza'), nullable=False)
    motivo = Column(Text, nullable=True)
    beneficios = Column(Text, nullable=False)
    fechaInicio = Column(Date, nullable=False)
    tiempo = Column(Integer, nullable=False)
    fechaPubli = Column(Date, nullable=True)
    estadoPubli = Column(Enum('Pendiente', 'Abierta', 'Cerrada', name='estado_publi'), nullable=True)

    empresa = relationship("Empresa", back_populates="plazas")
    postulaciones = relationship("Postulacion", back_populates="plaza")
