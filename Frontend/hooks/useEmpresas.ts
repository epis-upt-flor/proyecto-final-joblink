import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchEmpresas,
  fetchEmpresa,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
  fetchContratacionesEmpresa,
  type EmpresaInput,
} from "@/api/empresaApi"

export function useEmpresas() {
  return useQuery({
    queryKey: ["empresas"],
    queryFn: fetchEmpresas,
  })
}

export function useEmpresa(id: number) {
  return useQuery({
    queryKey: ["empresas", id],
    queryFn: () => fetchEmpresa(id),
    enabled: !!id,
  })
}

export function useCrearEmpresa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearEmpresa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] })
    },
  })
}

export function useActualizarEmpresa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EmpresaInput> }) => actualizarEmpresa(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] })
      queryClient.invalidateQueries({ queryKey: ["empresas", variables.id] })
    },
  })
}

export function useEliminarEmpresa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarEmpresa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] })
    },
  })
}

export function useContratacionesEmpresa(id: number) {
  return useQuery({
    queryKey: ["empresas", id, "contrataciones"],
    queryFn: () => fetchContratacionesEmpresa(id),
    enabled: !!id,
  })
}
