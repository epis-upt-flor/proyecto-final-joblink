const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"

export interface Oferta {
  id: number
  titulo: string
  tipo: string
  fechaCierre: string
  area: string
  modalidad: string
  horario: string
  vacantes: number
  experiencia: string
  locacion: string
  salario: number
  funciones: string[]
  requisitos: string[]
  estado: "ACTIVA" | "CERRADA" | "PENDIENTE"
  motivo?: string
  beneficios: string[]
  fechaInicio: string
  tiempo: number
  fechaPubli: string
  estadoPubli: "PUBLICADA" | "NO_PUBLICADA"
  idEmpresa: number
  empresa?: {
    id: number
    nombre: string
    logo?: string
  }
}
export interface OfertaUpdate {
  tipo?: string
  fechaCierre?: string
  modalidad?: string
  horario?: string
  vacantes?: number
  locacion?: string
  salario?: number
  estado?: "ACTIVA" | "CERRADA" | "PENDIENTE"
  motivo?: string
  beneficios?: string[]
  fechaInicio?: string
  tiempo?: number
  fechaPubli?: string
  estadoPubli?: "PUBLICADA" | "NO_PUBLICADA"
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function obtenerOfertas(): Promise<Oferta[]> {
  const res = await fetch(`${API_URL}/ofertas/`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Error al cargar ofertas")
  return res.json()
}

export async function obtenerOfertasPorEmpresa(empresaId: number): Promise<Oferta[]> {
  const res = await fetch(`${API_URL}/ofertas/empresa/${empresaId}/`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Error al cargar ofertas por empresa")
  return res.json()
}

export async function obtenerOferta(id: number): Promise<Oferta> {
  const res = await fetch(`${API_URL}/ofertas/${id}/`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Error al cargar oferta")
  return res.json()
}

export async function crearOferta(oferta: Partial<Oferta>): Promise<Oferta> {
  const res = await fetch(`${API_URL}/ofertas/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(oferta),
  })
  if (!res.ok) throw new Error("Error al crear oferta")
  return res.json()
}

export async function actualizarOferta(id: number, oferta: Partial<Oferta>): Promise<Oferta> {
  const res = await fetch(`${API_URL}/ofertas/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(oferta),
  })
  if (!res.ok) throw new Error("Error al actualizar oferta")
  return res.json()
}

export async function eliminarOferta(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/ofertas/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Error al eliminar oferta")
}

export async function aprobarOferta(id: number): Promise<Oferta> {
  const res = await fetch(`${API_URL}/ofertas/${id}/aprobar/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({}),
  })
  if (!res.ok) throw new Error("Error al aprobar oferta")
  return res.json()
}

export async function rechazarOferta(id: number, motivo: string): Promise<Oferta> {
  const res = await fetch(`${API_URL}/ofertas/${id}/rechazar/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ motivo }),
  })
  if (!res.ok) throw new Error("Error al rechazar oferta")
  return res.json()
}

export async function obtenerPostulacionesDeOferta(ofertaId: number): Promise<any[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/postulaciones/oferta/${ofertaId}`)
  if (!res.ok) throw new Error("No se pudieron obtener las postulaciones")
  return res.json()
}