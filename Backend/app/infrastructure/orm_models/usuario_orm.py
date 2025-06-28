from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database.base import Base

class UsuarioORM(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    idRol = Column(Integer, ForeignKey("roles.id"), nullable=False)

    tipo = Column(String(50))

    rol_relacion = relationship("RolORM", back_populates="usuarios")

    __mapper_args__ = {
        "polymorphic_on": tipo,
        "polymorphic_identity": "usuario",
    }
