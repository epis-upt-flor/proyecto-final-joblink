"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { iniciarRecomendacion } from "@/api/recomendarApi"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function RecomendarEgresadosPage() {
    const ejecutadoRef = useRef(false)
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (ejecutadoRef.current) return
            ejecutadoRef.current = true
            try {
                const id = Number(params.id)
                if (isNaN(id)) throw new Error("ID inválido")
                const result = await iniciarRecomendacion(id)
                setData(result)
            } catch (err: any) {
                console.error(err)
                setError("Error al obtener recomendaciones")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [params.id])

    if (loading) return <p className="text-center py-10">Cargando recomendaciones...</p>
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>

    return (
        <div className="container py-10 space-y-6">
            <h1 className="text-2xl font-bold">Egresados recomendados para la oferta #{params.id}</h1>

            {data?.recomendaciones?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {data.recomendaciones.map((egresado: any, index: number) => (
                        <li key={index}>
                            {egresado.nombres} - Score final: {egresado.score_final.toFixed(2)}%
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">No hay egresados recomendados para esta oferta.</p>
            )}


            <Button variant="outline" onClick={() => router.push("/oferta/" + params.id)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
            </Button>
        </div>
    )
}
