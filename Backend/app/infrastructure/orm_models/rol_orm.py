from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.infrastructure.database.base import Base


class RolORM(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    estado = Column(Boolean, default=True)

    usuarios = relationship("UsuarioORM", back_populates="rol_relacion")
