const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"

export interface Postulacion {
    id: number
    fechaRecomendacion: string
    posicionRanking: number | null
    estado: "pendiente" | "aprobada" | "rechazada" | string

    oferta: {
        id: number
        titulo: string
        area: string
        fechaCierre: string
        estado: string
        locacion: string
        modalidad: string
        salario: number
        empresa: {
            id: number
            nombre: string
            logo?: string
        }
    }

    egresado: {
        id: number
        nombres: string
        apellidos: string
        correo: string
        telefono?: string
        habilidades: string[]
        carrera: string
        avatar?: string
    }
}

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token")
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

export async function fetchPostulacionesPorEmpresa(idEmpresa: number): Promise<Postulacion[]> {
    const res = await fetch(`${API_URL}/postulaciones/empresa/${idEmpresa}`, {
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("Error al obtener postulaciones")
    return res.json()
}
