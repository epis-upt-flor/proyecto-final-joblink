from sqlalchemy import Column, Integer, String, ForeignKey
from app.infrastructure.database.singleton import Base
from app.domain.models.usuario import Usuario


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
