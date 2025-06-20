from sqlalchemy import Column, Integer, Date, ForeignKey, String
from sqlalchemy.orm import relationship
from app.infrastructure.database.base import Base

class ContratoORM(Base):
    __tablename__ = "contratos"

    id = Column(Integer, primary_key=True)
    idOfertaEgresado = Column(Integer, ForeignKey("oferta_egresado.id"), nullable=False)
    fechaFin = Column(Date)
    estado = Column(String, nullable=False)

    postulacion = relationship("PostulacionORM", back_populates="contrato")
