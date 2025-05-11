from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
from Backend.app.domain.models.enum import EstadoPostulacion
from Backend.app.infrastructure.database.database_singleton import Base

class Postulacion(Base):
    __tablename__ = "postulacion"

    id = Column(Integer, primary_key=True, index=True)
    idOferta = Column(Integer, ForeignKey('oferta.id'), nullable=False)
    idEgresado = Column(Integer, ForeignKey('egresado.id'), nullable=False)
    estado = Column(Enum(EstadoPostulacion), nullable=False)
    posicionRanking = Column(Integer, nullable=True)

    oferta = relationship("Oferta", back_populates="postulaciones")
    egresado = relationship("Egresado", back_populates="postulaciones")
    contratos = relationship("Contrato", back_populates="postulacion")
