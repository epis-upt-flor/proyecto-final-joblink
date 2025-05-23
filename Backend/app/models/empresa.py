from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base
from app.models.usuario import Usuario

class Empresa(Usuario):
    __tablename__ = "empresa"
    id = Column(Integer, ForeignKey("usuario.id"), primary_key=True)
    nombre = Column(String(100), nullable=False)
    ruc = Column(String(11), unique=True, nullable=False)
    telefono = Column(String(15), nullable=False)
    logo = Column(String)
    estado = Column(Boolean, default=True)

    __mapper_args__ = {
        "polymorphic_identity": "empresa",
    }