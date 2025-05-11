from app.infrastructure.security.security import Security
from fastapi import HTTPException


class TokenService:
    @staticmethod
    def verificar_token(token: str) -> dict:
        payload = Security.verificar_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Token inválido")
        return payload

    @staticmethod
    def crear_token(payload: dict) -> str:
        return Security.crear_token(payload)
