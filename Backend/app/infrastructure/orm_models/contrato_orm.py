from sqlalchemy import Column, Integer, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.infrastructure.database.base import Base
from app.domain.models.enum import EstadoContrato

class ContratoORM(Base):
    __tablename__ = "contratos"

    id = Column(Integer, primary_key=True)
    idOfertaEgresado = Column(Integer, ForeignKey("oferta_egresado.id"), nullable=False)
    fechaFin = Column(Date)
    estado = Column(Enum(EstadoContrato), nullable=False)

    postulacion = relationship("PostulacionORM", back_populates="contrato")
