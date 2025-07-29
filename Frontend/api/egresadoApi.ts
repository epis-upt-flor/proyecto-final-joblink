export type Egresado = {
  id: number
  nombres: string
  apellidos: string
  tipoDoc: string
  numDoc: string
  email: string
  telefono: string
  fechaNacimiento: string
  direccion?: string
  nacionalidad?: string
  habilidades?: string[]
  logrosAcademicos?: string[]
  certificados?: string[]
  experienciaLaboral?: {
    empresa: string;
    puesto: string;
    periodo: string;
    responsabilidades: string[];
  }[];

  idiomas?: { idioma: string; nivel: string }[]
  linkedin?: string
  github?: string
  cv?: string
  disponibilidad: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export type EgresadoInput = Omit<Egresado, "id">

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchEgresados(): Promise<Egresado[]> {
  const res = await fetch(`${API_URL}/egresados/`)
  if (!res.ok) throw new Error("Error al cargar egresados")
  return res.json()
}

export async function fetchEgresado(id: number): Promise<Egresado> {
  const res = await fetch(`${API_URL}/egresados/${id}`);

  console.log("Cargando egresado con ID:", id);

  if (!res.ok) throw new Error("Error al cargar egresado")
  return res.json()
}

export async function crearEgresado(data: EgresadoInput): Promise<Egresado> {
  const res = await fetch(`${API_URL}/egresados/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al crear egresado")
  return res.json()
}


export async function actualizarEgresado(id: number, data: Partial<EgresadoInput>): Promise<Egresado> {
  const res = await fetch(`${API_URL}/egresados/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al actualizar egresado")
  return res.json()
}

export async function eliminarEgresado(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/egresados/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Error al eliminar egresado")
}

export async function crearEgresadosMasivo(data: any[]): Promise<{ agregados: number; omitidos: any[] }> {
  const res = await fetch(`${API_URL}/egresados/carga-masiva`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (!res.ok) {
    const msg = result?.detail || "Error en la carga masiva de egresados"
    throw new Error(msg)
  }

  return result
}
