import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchContrataciones,
  fetchContratacion,
  crearContratacion,
  fetchEstadisticasContrataciones,
  exportarHistorialContrataciones,
} from "@/api/historialApi"

export function useContrataciones() {
  return useQuery({
    queryKey: ["contrataciones"],
    queryFn: fetchContrataciones,
  })
}

export function useContratacion(id: number) {
  return useQuery({
    queryKey: ["contrataciones", id],
    queryFn: () => fetchContratacion(id),
    enabled: !!id,
  })
}

export function useCrearContratacion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearContratacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrataciones"] })
      queryClient.invalidateQueries({ queryKey: ["estadisticas"] })
    },
  })
}

export function useEstadisticasContrataciones() {
  return useQuery({
    queryKey: ["estadisticas"],
    queryFn: fetchEstadisticasContrataciones,
  })
}

export function useExportarHistorial() {
  return useMutation({
    mutationFn: exportarHistorialContrataciones,
  })
}
