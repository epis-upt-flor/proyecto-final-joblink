const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function iniciarRecomendacion(ofertaId: number): Promise<any> {
    const res = await fetch(`${API_URL}/recomendar/oferta/${ofertaId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        throw new Error("Error al iniciar la recomendación")
    }

    return res.json()
}
