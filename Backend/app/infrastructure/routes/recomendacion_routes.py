from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.application.services.recomendador_service import RecomendadorService
from app.infrastructure.repositories.egresado_repository_sql import EgresadoRepositorySQL
from app.infrastructure.repositories.oferta_repository_sql import OfertaRepositorySQL
from app.infrastructure.schemas.recomendacion_schema import RecomendacionResponse

router = APIRouter(prefix="/recomendaciones", tags=["Recomendaciones"])
recomendador = RecomendadorService()
db_provider = DBSessionProvider()


@router.get("/recomendar/{oferta_id}", response_model=RecomendacionResponse)
def recomendar_por_oferta_endpoint(oferta_id: int, db: Session = Depends(db_provider.get_db)):
    oferta_repo = OfertaRepositorySQL(db)
    oferta = oferta_repo.obtener_por_id(oferta_id)

    if not oferta:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")

    resultado = recomendador.recomendar(oferta_id, db)
    return resultado


@router.post("/vector/egresado/{egresado_id}")
def agregar_egresado_a_vector_db_endpoint(egresado_id: int, db: Session = Depends(db_provider.get_db)):
    egresado_repo = EgresadoRepositorySQL(db)
    egresado = egresado_repo.obtener_egresado_por_id(egresado_id)

    if not egresado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")

    recomendador.agregar_egresado_a_vector_db(egresado)
    return {"mensaje": "Egresado agregado a la base vectorial correctamente"}


@router.post("/vector/oferta/{oferta_id}")
def agregar_oferta_a_vector_db_endpoint(oferta_id: int, db: Session = Depends(db_provider.get_db)):
    oferta_repo = OfertaRepositorySQL(db)
    oferta = oferta_repo.obtener_por_id(oferta_id)

    if not oferta:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")

    recomendador.agregar_oferta_a_vector_db(oferta)
    return {"mensaje": "Oferta agregada a la base vectorial correctamente"}
