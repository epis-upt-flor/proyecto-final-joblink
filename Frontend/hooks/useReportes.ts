import { useQuery } from "@tanstack/react-query"
import {
  fetchTasaExito,
  fetchEmpresasConMasContratos,
  fetchContratacionesPorArea,
  fetchPerfilEgresadosContratados,
  fetchRankingEgresados,
} from "@/api/reportesApi"

import type {
  TasaExitoItem,
  EmpresaContratacion,
  ContratacionAreaItem,
  PerfilEgresadoContratado,
  RankingEgresadoItem,
} from "@/types/Reporte"

export function useTasaExito() {
  return useQuery<TasaExitoItem[]>({
    queryKey: ["reportes", "tasa-exito"],
    queryFn: fetchTasaExito,
  })
}

export function useEmpresasConMasContratos() {
  return useQuery<EmpresaContratacion[]>({
    queryKey: ["reportes", "empresas"],
    queryFn: fetchEmpresasConMasContratos,
  })
}

export function useContratacionesPorArea() {
  return useQuery<ContratacionAreaItem[]>({
    queryKey: ["reportes", "contrataciones-area"],
    queryFn: fetchContratacionesPorArea,
  })
}

export function usePerfilEgresadosContratados() {
  return useQuery<PerfilEgresadoContratado>({
    queryKey: ["reportes", "perfil-egresados"],
    queryFn: fetchPerfilEgresadosContratados,
  })
}

export function useRankingEgresados() {
  return useQuery<RankingEgresadoItem[]>({
    queryKey: ["reportes", "ranking-egresados"],
    queryFn: fetchRankingEgresados,
  })
}
