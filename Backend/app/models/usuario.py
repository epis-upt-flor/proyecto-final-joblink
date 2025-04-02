from sqlalchemy import ForeignKey, Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)  # Cambio a username en vez de email
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "admin" o "empresa"
