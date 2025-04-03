from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base
from app.models.enum import TipoDocumento

class Administrador(Base):
    __tablename__ = "administrador"

    id = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefono = Column(String(15), nullable=False)
    tipoDoc = Column(Enum(TipoDocumento), nullable=False)
    numDoc = Column(String(15), unique=True, nullable=False)
    
    idUsuario = Column(Integer, ForeignKey("usuario.id"), unique=True, nullable=False)
    usuario = relationship("Usuario", backref="administrador", uselist=False)
