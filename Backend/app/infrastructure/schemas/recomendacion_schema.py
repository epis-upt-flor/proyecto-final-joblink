from pydantic import BaseModel

class RecomendacionResponse(BaseModel):
    criterios_usados: str
    recomendaciones: list
