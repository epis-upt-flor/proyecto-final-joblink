import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { fetchPostulacionesPorEmpresa } from "@/api/postulacionApi"
import { Postulacion } from "@/api/postulacionApi"

export function usePostulacionesEmpresa(
    idEmpresa: number,
    options?: Omit<UseQueryOptions<Postulacion[], Error>, "queryKey" | "queryFn">
) {
    return useQuery<Postulacion[]>({
        queryKey: ["postulaciones", "empresa", idEmpresa],
        queryFn: () => fetchPostulacionesPorEmpresa(idEmpresa),
        enabled: !!idEmpresa,
        ...options,
    })
}
