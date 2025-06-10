from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.orm_models.usuario_orm import UsuarioORM


class EmpresaORM(UsuarioORM):
    __tablename__ = "empresas"

    id = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)
    nombre = Column(String(100), nullable=False)
    ruc = Column(String(11), unique=True, nullable=False)
    telefono = Column(String(15), nullable=False)
    logo = Column(String)
    estado = Column(Boolean, default=True)

    __mapper_args__ = {
        "polymorphic_identity": "empresa",
    }

    ofertas = relationship(
        "OfertaORM", back_populates="empresa", cascade="all, delete-orphan")
