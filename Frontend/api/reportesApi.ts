const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface TasaExitoItem {
  egresado_id: number
  nombres: string
  apellidos: string
  postulaciones: number
  contratos: number
  tasa_exito: number
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchTasaExito(): Promise<TasaExitoItem[]> {
  const res = await fetch(`${API_URL}/reportes/tasa-exito`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Error al obtener tasa de éxito")
  return res.json()
}
