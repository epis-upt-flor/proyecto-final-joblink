from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base
from app.models.enum import TipoDocumento
from app.models.usuario import Usuario

class Administrador(Usuario):
    __tablename__ = "administrador"
    id = Column(Integer, ForeignKey("usuario.id"), primary_key=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    telefono = Column(String(15), nullable=False)
    tipoDoc = Column(String(20), nullable=False)
    numDoc = Column(String(15), unique=True, nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": "admin",
    }
