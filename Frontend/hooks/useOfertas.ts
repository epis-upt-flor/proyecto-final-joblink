import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  obtenerOfertas,
  obtenerOfertasPorEmpresa,
  obtenerOferta,
  crearOferta,
  actualizarOferta,
  eliminarOferta,
  aprobarOferta,
  rechazarOferta,
  type Oferta,
} from "@/api/ofertaApi"

export const useOfertas = () => {
  return useQuery({
    queryKey: ["ofertas"],
    queryFn: obtenerOfertas,
  })
}

export const useOfertasPorEmpresa = (empresaId: number) => {
  return useQuery({
    queryKey: ["ofertas", "empresa", empresaId],
    queryFn: () => obtenerOfertasPorEmpresa(empresaId),
    enabled: !!empresaId,
  })
}

export const useOferta = (id: number) => {
  return useQuery({
    queryKey: ["ofertas", id],
    queryFn: () => obtenerOferta(id),
    enabled: !!id,
  })
}

export const useCrearOferta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (oferta: Partial<Oferta>) => crearOferta(oferta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ofertas"] })
    },
  })
}

export const useActualizarOferta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, oferta }: { id: number; oferta: Partial<Oferta> }) => actualizarOferta(id, oferta),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ofertas"] })
      queryClient.invalidateQueries({ queryKey: ["ofertas", variables.id] })
    },
  })
}

export const useEliminarOferta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => eliminarOferta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ofertas"] })
    },
  })
}

export const useAprobarOferta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => aprobarOferta(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["ofertas"] })
      queryClient.invalidateQueries({ queryKey: ["ofertas", id] })
    },
  })
}

export const useRechazarOferta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) => rechazarOferta(id, motivo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ofertas"] })
      queryClient.invalidateQueries({ queryKey: ["ofertas", variables.id] })
    },
  })
}
