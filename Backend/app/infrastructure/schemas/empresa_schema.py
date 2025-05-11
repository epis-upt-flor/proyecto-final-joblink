from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class EmpresaBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=100)
    ruc: str = Field(..., min_length=11, max_length=11)
    telefono: str = Field(..., min_length=7, max_length=15)
    logo: Optional[str] = None
    estado: bool


class EmpresaCreate(EmpresaBase):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    rol: str = "empresa"


class EmpresaOut(EmpresaBase):
    id: int
    username: str
    email: EmailStr
    rol: str

    class Config:
        orm_mode = True
