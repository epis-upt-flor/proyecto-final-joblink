import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchEgresados,
  fetchEgresado,
  crearEgresado,
  actualizarEgresado,
  eliminarEgresado,
  cargaMasivaEgresados,
  type EgresadoInput,
} from "@/api/egresadoApi"

export function useEgresados() {
  return useQuery({
    queryKey: ["egresados"],
    queryFn: fetchEgresados,
  })
}

export function useEgresado(id: number) {
  return useQuery({
    queryKey: ["egresados", id],
    queryFn: () => fetchEgresado(id),
    enabled: !!id,
  })
}

export function useCrearEgresado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearEgresado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["egresados"] })
    },
  })
}

export function useActualizarEgresado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EgresadoInput> }) => actualizarEgresado(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["egresados"] })
      queryClient.invalidateQueries({ queryKey: ["egresados", variables.id] })
    },
  })
}

export function useEliminarEgresado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarEgresado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["egresados"] })
    },
  })
}

export function useCargaMasivaEgresados() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cargaMasivaEgresados,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["egresados"] })
    },
  })
}
