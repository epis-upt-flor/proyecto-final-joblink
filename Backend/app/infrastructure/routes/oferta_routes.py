from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.database.db_session_provider import DBSessionProvider
from app.application.services.oferta_service import OfertaService

router = APIRouter(prefix="/ofertas", tags=["Ofertas"])
oferta_service = OfertaService()
db_provider = DBSessionProvider()

@router.post("/")
async def registrar_oferta_endpoint(request: Request, db: Session = Depends(db_provider.get_db)):
    data = await request.json()
    oferta = oferta_service.registrar_oferta(db, data)
    if not oferta:
        raise HTTPException(
            status_code=400, detail="Error al registrar la oferta.")
    return {"message": "Oferta registrada", "id": oferta.id}

@router.get("/")
async def listar_ofertas_endpoint(db: Session = Depends(db_provider.get_db)):
    return oferta_service.listar_ofertas(db)

@router.get("/{id}")
async def obtener_oferta_endpoint(id: int, db: Session = Depends(db_provider.get_db)):
    oferta = oferta_service.obtener_oferta_por_id(db, id)
    if not oferta:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    return oferta

@router.put("/{id}")
async def actualizar_oferta_endpoint(id: int, request: Request, db: Session = Depends(db_provider.get_db)):
    data = await request.json()
    actualizada = oferta_service.actualizar_oferta(db, id, data)
    if not actualizada:
        raise HTTPException(
            status_code=404, detail="Oferta no encontrada o error al actualizar")
    return {"message": "Oferta actualizada", "id": actualizada.id}

@router.delete("/{id}")
async def eliminar_oferta_endpoint(id: int, db: Session = Depends(db_provider.get_db)):
    ok = oferta_service.eliminar_oferta(db, id)
    if not ok:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    return {"message": "Oferta eliminada"}
