from pydantic import BaseModel

class RankingEgresadoOut(BaseModel):
    egresado_id: int
    nombres: str
    apellidos: str
    ranking_promedio: float
    total_contratos: int
