from typing import List, Dict
from app.domain.interfaces.internal.reporte_usecase import ReporteUseCase
from app.domain.interfaces.external.postulacion_repository import PostulacionRepository
from app.domain.interfaces.external.contrato_repository import ContratoRepository
from app.domain.interfaces.external.egresado_repository import EgresadoRepository

class ReporteService(ReporteUseCase):
    def __init__(
        self,
        postulacion_repo: PostulacionRepository,
        contrato_repo: ContratoRepository,
        egresado_repo: EgresadoRepository,
    ):
        self.postulacion_repo = postulacion_repo
        self.contrato_repo = contrato_repo
        self.egresado_repo = egresado_repo

    def tasa_exito_egresados(self) -> List[Dict]:
        postulaciones = self.postulacion_repo.obtener_postulaciones_por_egresado()
        contratos = self.contrato_repo.obtener_contratos_por_egresado()
        contratos_por_id = {c["egresado_id"]: c["total"] for c in contratos}

        egresado_ids = [p["egresado_id"] for p in postulaciones]
        egresados = self.egresado_repo.obtener_nombres_por_ids(egresado_ids)
        nombres_por_id = {e["id"]: {"nombres": e["nombres"], "apellidos": e["apellidos"]} for e in egresados}

        resultado = []
        for p in postulaciones:
            eid = p["egresado_id"]
            total_post = p["total"]
            total_contratos = contratos_por_id.get(eid, 0)
            tasa = round((total_contratos / total_post) * 100, 2) if total_post > 0 else 0

            nombres = nombres_por_id.get(eid, {"nombres": "Desconocido", "apellidos": ""})

            resultado.append({
                "egresado_id": eid,
                "nombres": nombres["nombres"],
                "apellidos": nombres["apellidos"],
                "postulaciones": total_post,
                "contratos": total_contratos,
                "tasa_exito": tasa
            })

        return resultado
