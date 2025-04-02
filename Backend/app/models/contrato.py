from sqlalchemy import ForeignKey, Column, Integer, Date, Enum
from sqlalchemy.orm import relationship
from app.models.database import Base

class Contrato(Base):
    __tablename__ = "contratos"

    id = Column(Integer, primary_key=True, index=True)
    idPostulacion = Column(Integer, ForeignKey("postulaciones.id"), nullable=False)
    fechaFin = Column(Date, nullable=False)
    estado = Column(Enum('Iniciado', 'Finalizado', name='estado_contrato'), nullable=False)

    postulacion = relationship("Postulacion", back_populates="contrato")
