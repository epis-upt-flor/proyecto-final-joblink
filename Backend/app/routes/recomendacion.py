from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.recomendador import Recomendador
from app.models.egresado import Egresado
from app.models.oferta import Oferta

router = APIRouter()
recomendador = Recomendador()


@router.get("/recomendar/{oferta_id}")
def recomendar_por_oferta_endpoint(oferta_id: int, db: Session = Depends(get_db)):
    return recomendador.recomendar(oferta_id, db)


@router.post("/vector/egresado/{egresado_id}")
def agregar_egresado_a_vector_db_endpoint(egresado_id: int, db: Session = Depends(get_db)):
    egresado = db.query(Egresado).filter(Egresado.id == egresado_id).first()
    if not egresado:
        raise HTTPException(status_code=404, detail="Egresado no encontrado")

    recomendador.agregar_egresado_a_vector_db(egresado)
    return {"mensaje": "Egresado agregado a la base vectorial correctamente"}


@router.post("/vector/oferta/{oferta_id}")
def agregar_oferta_a_vector_db_endpoint(oferta_id: int, db: Session = Depends(get_db)):
    oferta = db.query(Oferta).filter(Oferta.id == oferta_id).first()
    if not oferta:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")

    recomendador.agregar_oferta_a_vector_db(oferta)
    return {"mensaje": "Oferta agregada a la base vectorial correctamente"}
