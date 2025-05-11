from sqlalchemy import Column, Integer, ForeignKey, Date, String
from sqlalchemy.orm import relationship
from app.infrastructure.database.database_singleton import Base

class Contrato(Base):
    __tablename__ = "contrato"

    id = Column(Integer, primary_key=True, index=True)
    idPostulacion = Column(Integer, ForeignKey('postulacion.id'), nullable=False)
    fechaFin = Column(Date, nullable=False)
    estado = Column(String, nullable=False)

    postulacion = relationship("Postulacion", back_populates="contratos")
