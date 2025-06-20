import type { Egresado } from "./egresadoApi"
import type { Empresa } from "./empresaApi"

export type Contratacion = {
  id: number
  egresado: Egresado
  empresa: Empresa
  puesto: string
  fechaContratacion: string
  recomendadoPorSistema: boolean
  detalles?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export type ContratacionInput = Omit<Contratacion, "id" | "egresado" | "empresa"> & {
  egresadoId: number
  empresaId: number
}

export async function fetchContrataciones(): Promise<Contratacion[]> {
  const res = await fetch(`${API_URL}/contrataciones/`)
  if (!res.ok) throw new Error("Error al cargar contrataciones")
  return res.json()
}

export async function fetchContratacion(id: number): Promise<Contratacion> {
  const res = await fetch(`${API_URL}/contrataciones/${id}`)
  if (!res.ok) throw new Error("Error al cargar contratación")
  return res.json()
}

export async function crearContratacion(data: ContratacionInput): Promise<Contratacion> {
  const res = await fetch(`${API_URL}/contrataciones/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al crear contratación")
  return res.json()
}

// Obtener estadísticas de contrataciones
export async function fetchEstadisticasContrataciones(): Promise<any> {
  const res = await fetch(`${API_URL}/contrataciones/estadisticas`)
  if (!res.ok) throw new Error("Error al cargar estadísticas")
  return res.json()
}

// Exportar historial de contrataciones
export async function exportarHistorialContrataciones(): Promise<Blob> {
  const res = await fetch(`${API_URL}/contrataciones/exportar`)
  if (!res.ok) throw new Error("Error al exportar historial")
  return res.blob()
}
