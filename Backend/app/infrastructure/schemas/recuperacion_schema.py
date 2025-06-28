from pydantic import BaseModel


class EmailRequest(BaseModel):
    email: str


class CambioPasswordRequest(BaseModel):
    token: str
    nueva_contrasena: str
