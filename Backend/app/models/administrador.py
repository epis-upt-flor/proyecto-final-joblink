from sqlalchemy import ForeignKey, Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.models.database import Base

class Administrador(Base):
    __tablename__ = "administradores"

    id = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefono = Column(String(15), nullable=False)
    tipoDoc = Column(Integer, nullable=False)
    numDoc = Column(String(15), unique=True, nullable=False)
    idUser = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)

    usuario = relationship("Usuario", back_populates="administrador")
