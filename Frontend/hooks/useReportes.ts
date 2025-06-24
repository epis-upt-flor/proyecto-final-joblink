import { useQuery } from "@tanstack/react-query"
import { fetchTasaExito } from "@/api/reportesApi"

export function useTasaExito() {
  return useQuery({
    queryKey: ["reportes", "tasa-exito"],
    queryFn: fetchTasaExito,
  })
}
