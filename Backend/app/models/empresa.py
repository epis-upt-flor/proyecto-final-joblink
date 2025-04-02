from sqlalchemy import ForeignKey, Column, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from app.models.database import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    ruc = Column(String(11), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefono = Column(String(15), nullable=False)
    logo = Column(Text)
    estado = Column(Boolean, default=True)
    idUser = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)

    usuario = relationship("Usuario", back_populates="empresa")
