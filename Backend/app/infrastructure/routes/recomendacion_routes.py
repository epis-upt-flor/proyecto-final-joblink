# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.infrastructure.database.db_session_provider import DBSessionProvider
# from app.application.services.recomendador_service import RecomendadorService
# from app.infrastructure.orm_models.egresado_orm import Egresado
# from app.infrastructure.orm_models.oferta_orm import Oferta

# router = APIRouter()
# recomendador = RecomendadorService()
# db_provider = DBSessionProvider()

# @router.get("/recomendar/{oferta_id}")
# def recomendar_por_oferta_endpoint(oferta_id: int, db: Session = Depends(db_provider.get_db)):
#     return recomendador.recomendar(oferta_id, db)


# @router.post("/vector/egresado/{egresado_id}")
# def agregar_egresado_a_vector_db_endpoint(egresado_id: int, db: Session = Depends(db_provider.get_db)):
#     egresado = db.query(Egresado).filter(Egresado.id == egresado_id).first()
#     if not egresado:
#         raise HTTPException(status_code=404, detail="Egresado no encontrado")

#     recomendador.agregar_egresado_a_vector_db(egresado)
#     return {"mensaje": "Egresado agregado a la base vectorial correctamente"}


# @router.post("/vector/oferta/{oferta_id}")
# def agregar_oferta_a_vector_db_endpoint(oferta_id: int, db: Session = Depends(db_provider.get_db)):
#     oferta = db.query(Oferta).filter(Oferta.id == oferta_id).first()
#     if not oferta:
#         raise HTTPException(status_code=404, detail="Oferta no encontrada")

#     recomendador.agregar_oferta_a_vector_db(oferta)
#     return {"mensaje": "Oferta agregada a la base vectorial correctamente"}
