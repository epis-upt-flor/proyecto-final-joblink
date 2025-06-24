from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database.db_session_provider import DBSessionProvider

from app.application.services.reporte_service import ReporteService
from app.infrastructure.repositories.postulacion_repository_sql import PostulacionRepositorySQL
from app.infrastructure.repositories.contrato_repository_sql import ContratoRepositorySQL
from app.infrastructure.repositories.egresado_repository_sql import EgresadoRepositorySQL
from app.infrastructure.repositories.empresa_repository_sql import EmpresaRepositorySQL
from app.domain.interfaces.internal.reporte_usecase import ReporteUseCase

router = APIRouter(prefix="/reportes", tags=["Reportes"])
db_provider = DBSessionProvider()

# 💉 Inyección de dependencias completa
def get_reporte_service(db: Session = Depends(db_provider.get_db)) -> ReporteUseCase:
    post_repo = PostulacionRepositorySQL(db)
    cont_repo = ContratoRepositorySQL(db)
    egresado_repo = EgresadoRepositorySQL(db)
    empresa_repo = EmpresaRepositorySQL(db)
    return ReporteService(post_repo, cont_repo, egresado_repo, empresa_repo)

@router.get("/tasa-exito")
def reporte_tasa_exito(service: ReporteUseCase = Depends(get_reporte_service)):
    return service.tasa_exito_egresados()

@router.get("/empresas-contrataciones")
def reporte_empresas_contratantes(service: ReporteUseCase = Depends(get_reporte_service)):
    return service.empresas_con_mas_contrataciones()
