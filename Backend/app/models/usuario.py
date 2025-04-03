from sqlalchemy import Column, Integer, String
from app.models.database import Base

class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    rol = Column(String(10), nullable=False)
