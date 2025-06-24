from typing import List, Dict
from app.domain.interfaces.internal.reporte_usecase import ReporteUseCase
from app.domain.interfaces.external.postulacion_repository import PostulacionRepository
from app.domain.interfaces.external.contrato_repository import ContratoRepository
from app.domain.interfaces.external.egresado_repository import EgresadoRepository
from app.domain.interfaces.external.empresa_repository import IEmpresaRepository
from collections import Counter

class ReporteService(ReporteUseCase):
    def __init__(
        self,
        postulacion_repo: PostulacionRepository,
        contrato_repo: ContratoRepository,
        egresado_repo: EgresadoRepository,
        empresa_repo: IEmpresaRepository,
    ):
        self.postulacion_repo = postulacion_repo
        self.contrato_repo = contrato_repo
        self.egresado_repo = egresado_repo
        self.empresa_repo = empresa_repo

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

    def empresas_con_mas_contrataciones(self) -> List[Dict]:
        datos = self.contrato_repo.obtener_contratos_agrupados_por_empresa()
        empresa_ids = [d["empresa_id"] for d in datos]
        nombres = self.empresa_repo.obtener_nombres_por_ids(empresa_ids)
        nombres_dict = {e["id"]: e["nombre"] for e in nombres}

        return [
            {
                "empresa_id": d["empresa_id"],
                "nombre": nombres_dict.get(d["empresa_id"], "Desconocido"),
                "total_contratos": d["total_contratos"],
                "promedio_dias": d["promedio_dias"],
                "reincidencia": d["egresados_distintos"] > 1
            }
            for d in datos
        ]
        
    def tendencias_contratacion_por_area(self) -> List[Dict]:
        return self.contrato_repo.obtener_contratos_por_area_y_fecha()

    def perfil_egresados_contratados(self) -> Dict:
        contratados = self.contrato_repo.obtener_egresados_con_contrato()

        todas_habilidades = []
        todos_idiomas = []

        for egresado in contratados:
            todas_habilidades.extend([
                h["nombre"] for h in egresado.get("habilidades", []) if isinstance(h, dict) and "nombre" in h
            ])
            todos_idiomas.extend([
                i["idioma"] for i in egresado.get("idiomas", []) if isinstance(i, dict) and "idioma" in i
            ])

        habilidades_comunes = Counter(todas_habilidades).most_common(5)
        idiomas_comunes = Counter(todos_idiomas).most_common(5)

        return {
            "habilidades_top": habilidades_comunes,
            "idiomas_top": idiomas_comunes
        }

    def ranking_egresados(self) -> List[Dict]:
        datos_ranking = self.postulacion_repo.obtener_ranking_promedio_egresados()
        egresados = {e.id: e for e in self.egresado_repo.obtener_egresados()}
        
        contratos_lista = self.contrato_repo.obtener_contratos_por_egresado()
        contratos_por_egresado = {c["egresado_id"]: c["total"] for c in contratos_lista}


        resultado = []
        for item in datos_ranking:
            egresado = egresados.get(item["egresado_id"])
            if egresado:
                resultado.append({
                    "egresado_id": item["egresado_id"],
                    "nombres": egresado.nombres,
                    "apellidos": egresado.apellidos,
                    "ranking_promedio": item["ranking_promedio"],
                    "total_contratos": contratos_por_egresado.get(item["egresado_id"], 0)
                })
        return resultado


