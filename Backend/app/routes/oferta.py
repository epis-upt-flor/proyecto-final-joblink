from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.oferta_service import *

router = APIRouter(prefix="/ofertas", tags=["Ofertas"])

@router.post("/")
async def registrar_oferta(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    oferta = registrar_oferta(db, data)
    if not oferta:
        raise HTTPException(status_code=400, detail="Error al registrar la oferta.")
    return {
        "message": "Oferta registrada",
        "id": oferta.id
    }
