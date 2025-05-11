from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class AdministradorBase(BaseModel):
    nombres: str = Field(..., min_length=3, max_length=100)
    apellidos: str = Field(..., min_length=3, max_length=100)
    telefono: str = Field(..., min_length=7, max_length=15)
    tipo_doc: str = Field(..., min_length=1, max_length=20)
    num_doc: str = Field(..., min_length=6, max_length=20)


class AdministradorCreate(AdministradorBase):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    rol: str = "admin"


class AdministradorOut(AdministradorBase):
    id: int
    username: str
    email: EmailStr
    rol: str

    class Config:
        orm_mode = True
