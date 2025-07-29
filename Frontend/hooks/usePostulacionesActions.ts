import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL

async function aprobarPostulacion(id: number) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${apiUrl}/postulaciones/${id}/aprobar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) throw new Error("Error al aprobar postulación")
    return res.json()
}

async function rechazarPostulacion(id: number) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${apiUrl}/postulaciones/${id}/rechazar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) throw new Error("Error al rechazar postulación")
    return res.json()
}

export function usePostulacionActions(idEmpresa: number) {
    const queryClient = useQueryClient()

    const aprobar = useMutation({
        mutationFn: aprobarPostulacion,
        onSuccess: () => {
            toast("Postulación aprobada exitosamente")
            queryClient.invalidateQueries({ queryKey: ["postulaciones", "empresa", idEmpresa] })
        },
        onError: (error) => {
            toast("Error al aprobar", {
                description: String(error),
            })
        },
    })

    const rechazar = useMutation({
        mutationFn: rechazarPostulacion,
        onSuccess: () => {
            toast("Postulación rechazada exitosamente")
            queryClient.invalidateQueries({ queryKey: ["postulaciones", "empresa", idEmpresa] })
        },
        onError: (error) => {
            toast("Error al rechazar", {
                description: String(error),
            })
        },
    })

    return { aprobar, rechazar }
}
