const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface Empresa {
  id: number
  username: string
  email: string
  password: string
  idRol: number
  nombre: string
  ruc: string
  telefono: string
  logo?: string
  estado: boolean
}



export type EmpresaInput = Omit<Empresa, "id">

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchEmpresas(): Promise<Empresa[]> {
  const res = await fetch(`${API_URL}/empresas/`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Error al obtener empresas")
  return res.json()
}

export async function fetchEmpresa(id: number): Promise<Empresa> {
  const res = await fetch(`${API_URL}/empresas/${id}`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Error al obtener empresa")
  return res.json()
}

export async function crearEmpresa(data: EmpresaInput): Promise<any> {
  const res = await fetch(`${API_URL}/auth/register/empresa`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al registrar empresa")
  return res.json()
}


export async function actualizarEmpresa(id: number, data: Partial<EmpresaInput>): Promise<Empresa> {
  const res = await fetch(`${API_URL}/empresas/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al actualizar empresa")
  return res.json()
}

export async function eliminarEmpresa(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/empresas/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Error al eliminar empresa")
}

export async function fetchContratacionesEmpresa(id: number): Promise<any[]> {
  const res = await fetch(`${API_URL}/empresas/${id}/contrataciones/`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error("Error al obtener contrataciones de empresa")
  return res.json()
}
