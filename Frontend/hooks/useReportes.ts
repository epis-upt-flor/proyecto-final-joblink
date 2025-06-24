import { useQuery } from "@tanstack/react-query"
import { fetchTasaExito } from "@/api/reportesApi"

export function useTasaExito() {
  return useQuery({
    queryKey: ["reportes", "tasa-exito"],
    queryFn: fetchTasaExito,
  })
}

import { fetchEmpresasConMasContratos, EmpresaContratacion } from "@/api/reportesApi"

export function useEmpresasConMasContratos() {
  return useQuery<EmpresaContratacion[]>({
    queryKey: ["reportes", "empresas"],
    queryFn: fetchEmpresasConMasContratos,
  })
}
