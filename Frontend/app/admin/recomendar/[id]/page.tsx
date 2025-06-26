"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { iniciarRecomendacion } from "@/api/recomendarApi"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Particles from "react-tsparticles";
import { particlesInit } from "@/lib/particlesInit";

export default function RecomendarEgresadosPage() {
    const ejecutadoRef = useRef(false)
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (ejecutadoRef.current) return
            ejecutadoRef.current = true
            try {
                const id = Number(params.id)
                if (isNaN(id)) throw new Error("ID inválido")

                const result = await iniciarRecomendacion(id)
                setData(result)
                setTimeout(() => {
                    setShowResult(true)
                    setLoading(false)
                }, 7000)
            } catch (err: any) {
                console.error(err)
                setError("Error al obtener recomendaciones")
                setLoading(false)
            }
        }

        fetchData()
    }, [params.id])

    return (
        <div className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden">
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    background: { color: { value: "#000000" } },
                    fpsLimit: 60,
                    particles: {
                        color: { value: "#ffffff" },
                        links: {
                            color: "#ffffff",
                            distance: 100,
                            enable: true,
                            opacity: 0.2,
                            width: 1,
                        },
                        move: {
                            enable: true,
                            speed: 1,
                            direction: "none",
                            outModes: "out",
                        },
                        number: { value: 60 },
                        opacity: { value: 0.5 },
                        shape: { type: "circle" },
                        size: { value: { min: 1, max: 3 } },
                    },
                    detectRetina: true,
                }}
                className="absolute inset-0 -z-10"
            />

            <header className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white py-6 shadow-md text-center">
                <h1 className="text-3xl font-bold">LinkJob</h1>
                <p className="mt-1 text-sm opacity-80">IA analizando habilidades, experiencias y patrones previos de éxito</p>
            </header>

            <main className="container mx-auto flex-1 py-12 px-6 text-center">
                {loading && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="space-y-6"
                    >
                        <div className="text-xl font-semibold animate-pulse text-blue-200">
                            Procesando embeddings...<br />
                            Analizando compatibilidad semántica...<br />
                            Consultando historial de contrataciones...
                        </div>

                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto border-blue-400"></div>
                        <p className="text-sm text-muted-foreground">Esto tomará unos segundos, gracias por tu paciencia.</p>
                    </motion.div>
                )}

                {error && <p className="text-red-500">{error}</p>}

                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-white">Recomendaciones para la oferta #{params.id}</h2>

                        {data?.recomendaciones?.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2 text-left text-gray-200 max-w-2xl mx-auto">
                                {data.recomendaciones.map((egresado: any, index: number) => (
                                    <li key={index}>
                                        <span className="font-semibold">{egresado.nombres}</span> –{" "}
                                        <span className="text-blue-400">Score final: {egresado.score_final.toFixed(2)}%</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No se encontraron egresados compatibles para esta oferta.</p>
                        )}

                        <Button variant="outline" onClick={() => router.push("/oferta/" + params.id)}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a la oferta
                        </Button>
                    </motion.div>
                )}
            </main>

            <footer className="bg-zinc-900 text-center py-4 text-sm text-gray-400 border-t border-gray-800">
                © 2025 LinkJob – Potenciando empleabilidad con inteligencia artificial
            </footer>
        </div>
    )
}
