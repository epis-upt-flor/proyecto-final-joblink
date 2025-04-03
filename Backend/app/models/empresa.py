from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base

class Empresa(Base):
    __tablename__ = "empresa"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    ruc = Column(String(11), unique=True, nullable=False)
    telefono = Column(String(15), nullable=False)
    logo = Column(String)
    estado = Column(Boolean, default=True)
    
    idUsuario = Column(Integer, ForeignKey("usuario.id"), unique=True, nullable=False)
    usuario = relationship("Usuario", backref="empresa", uselist=False)
