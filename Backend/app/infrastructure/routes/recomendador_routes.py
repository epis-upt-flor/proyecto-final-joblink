from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.application.services.contrato_service import ContratoService
from app.infrastructure.database.db_session_provider import DBSessionProvider

from app.infrastructure.repositories.vector_db_repository_upstash import VectorDBRepositoryUpstash
from app.infrastructure.repositories.oferta_repository_sql import OfertaRepositorySQL
from app.infrastructure.repositories.contrato_repository_sql import ContratoRepositorySQL
from app.infrastructure.repositories.egresado_repository_sql import EgresadoRepositorySQL
from app.infrastructure.repositories.postulacion_repository_sql import PostulacionRepositorySQL
from app.application.services.recomendador_service import RecomendadorService
from app.application.services.postulacion_service import PostulacionService

from app.domain.interfaces.internal.recomendador_usecase import RecomendadorUseCase

router = APIRouter(prefix="/recomendar", tags=["Recomendación"])
db_provider = DBSessionProvider()

# 💉 Dependency Injection


def get_recomendador_service(
    db: Session = Depends(db_provider.get_db)
) -> RecomendadorUseCase:
    vector_repo = VectorDBRepositoryUpstash()
    oferta_repo = OfertaRepositorySQL(db)
    contrato_repo = ContratoRepositorySQL(db)
    egresado_repo = EgresadoRepositorySQL(db)
    postulacion_repo = PostulacionRepositorySQL(db)
    contrato_service = ContratoService(contrato_repo)
    postulacion_service = PostulacionService(
        postulacion_repo, contrato_service)

    return RecomendadorService(
        vector_repo=vector_repo,
        oferta_repo=oferta_repo,
        contrato_repo=contrato_repo,
        egresado_repo=egresado_repo,
        postulacion_repo=postulacion_repo,
        postulacion_service=postulacion_service
    )


@router.post("/oferta/{oferta_id}")
def recomendar_por_oferta(
    oferta_id: int,
    db: Session = Depends(db_provider.get_db),
    recomendador: RecomendadorUseCase = Depends(get_recomendador_service)
):
    return recomendador.recomendar(oferta_id=oferta_id, db_session=db)
