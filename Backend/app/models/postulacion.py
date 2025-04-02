from sqlalchemy import ForeignKey, Column, Integer, Enum
from sqlalchemy.orm import relationship
from app.models.database import Base

class Postulacion(Base):
    __tablename__ = "postulaciones"

    id = Column(Integer, primary_key=True, index=True)
    idPlaza = Column(Integer, ForeignKey("plazas.id"), nullable=False)
    idEgresado = Column(Integer, ForeignKey("egresados.id"), nullable=False)
    estado = Column(Enum('En revisión', 'Aceptada', 'Rechazada', name='estado_postulacion'), nullable=False)
    ranking = Column(Integer, nullable=False)

    plaza = relationship("Plaza", back_populates="postulaciones")
    egresado = relationship("Egresado", back_populates="postulaciones")
    contrato = relationship("Contrato", back_populates="postulacion")
