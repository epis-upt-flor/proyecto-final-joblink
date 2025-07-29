from pydantic import BaseModel
from typing import Optional

class EmpresaOut(BaseModel):
    id: int
    nombre: str
    ruc: str
    telefono: str
    logo: Optional[str]
    estado: bool
    
    class Config:
        from_attributes = True
        
        
class EmpresaIn(BaseModel):
    nombre: str
    ruc: str
    telefono: str
    logo: Optional[str]
    estado: bool