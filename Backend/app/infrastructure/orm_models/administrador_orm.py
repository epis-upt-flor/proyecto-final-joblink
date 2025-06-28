from sqlalchemy import Column, String, Integer, ForeignKey
from app.infrastructure.orm_models.usuario_orm import UsuarioORM


class AdministradorORM(UsuarioORM):
    __tablename__ = "administradores"

    id = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    telefono = Column(String(15), nullable=False)
    tipoDoc = Column(String(20), nullable=False)
    numDoc = Column(String(15), unique=True, nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": "admin",
    }
