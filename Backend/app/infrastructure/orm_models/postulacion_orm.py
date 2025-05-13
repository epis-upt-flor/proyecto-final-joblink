from sqlalchemy import Column, Integer, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.infrastructure.database.base import Base
from app.domain.models.enum import EstadoPostulacion

class PostulacionORM(Base):
    __tablename__ = "oferta_egresado"

    id = Column(Integer, primary_key=True)
    idOferta = Column(Integer, ForeignKey("ofertas.id"), nullable=False)
    idEgresado = Column(Integer, ForeignKey("egresados.id"), nullable=False)
    fechaRecomendacion = Column(Date, nullable=False)
    posicionRanking = Column(Integer)
    estado = Column(Enum(EstadoPostulacion), nullable=False)

    oferta = relationship("OfertaORM", back_populates="postulaciones")
    egresado = relationship("EgresadoORM", back_populates="postulaciones")

    contrato = relationship("ContratoORM", back_populates="postulacion", uselist=False)
