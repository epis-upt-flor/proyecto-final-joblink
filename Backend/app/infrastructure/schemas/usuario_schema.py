from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UsuarioBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    rol: str


class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=6)


class UsuarioOut(UsuarioBase):
    id: int

    class Config:
        orm_mode = True
