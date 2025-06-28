from pydantic import BaseModel, EmailStr
from typing import Optional

# ---------- LOGIN ----------

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ---------- USUARIO BASE ----------

class UsuarioBase(BaseModel):
    username: str
    email: EmailStr
    password: str
    idRol: int

# ---------- REGISTRO DE EMPRESA ----------

class EmpresaCreate(UsuarioBase):
    nombre: str
    ruc: str
    telefono: str
    logo: Optional[str] = None

# ---------- REGISTRO DE ADMIN ----------

class AdminCreate(UsuarioBase):
    nombres: str
    apellidos: str
    telefono: str
    tipoDoc: str
    numDoc: str

# ---------- RESPUESTA GENERAL ----------

class UsuarioOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    idRol: int

    model_config = {
        "from_attributes": True
    }
