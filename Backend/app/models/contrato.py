from sqlalchemy import Column, Integer, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from app.models.enum import EstadoContrato
from app.models.database import Base

class Contrato(Base):
    __tablename__ = "contrato"

    id = Column(Integer, primary_key=True, index=True)
    idPostulacion = Column(Integer, ForeignKey('postulacion.id'), nullable=False)
    fechaFin = Column(Date, nullable=False)
    estado = Column(Enum(EstadoContrato), nullable=False)

    postulacion = relationship("Postulacion", back_populates="contratos")
