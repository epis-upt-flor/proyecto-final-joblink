"use client"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { obtenerOferta } from "@/api/ofertaApi"
import { fetchEmpresa } from "@/api/empresaApi"
import { obtenerPostulacionesDeOferta } from "@/api/ofertaApi"

import {
    Building2, MapPin, Clock, Users, Briefcase, GraduationCap, DollarSign, ArrowLeft
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function OfertaDetallePage() {
    const params = useParams()
    const router = useRouter()
    const [oferta, setOferta] = useState<any | null>(null)
    const [empresa, setEmpresa] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [yaRecomendado, setYaRecomendado] = useState(false)
    const [mostrarPostulados, setMostrarPostulados] = useState(false)
    const [postulados, setPostulados] = useState<any[]>([])
    const [rol, setRol] = useState<number | null>(null)

    useEffect(() => {
        const getData = async () => {
            try {
                const id = Number(params.id)
                if (isNaN(id)) return
                if (typeof window !== "undefined") {
                    const token = localStorage.getItem("token")
                    if (token) {
                        try {
                            interface DecodedToken {
                                role: number
                                [key: string]: any
                            }
                            const decoded = jwtDecode<DecodedToken>(token)
                            setRol(decoded.role)
                        } catch (err) {
                            console.error("Error al decodificar token:", err)
                        }
                    }
                }
                const fetchedOferta = await obtenerOferta(id)
                setOferta(fetchedOferta)

                const fetchedEmpresa = await fetchEmpresa(fetchedOferta.idEmpresa)
                setEmpresa(fetchedEmpresa)

                const postulados = await obtenerPostulacionesDeOferta(id)
                setYaRecomendado(postulados.length > 0)
            } catch (error) {
                console.error("Error al cargar datos de oferta:", error)
                router.push("/admin")
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [params.id, router])

    if (loading) return <p className="text-center py-10">Cargando oferta...</p>
    if (!oferta || !empresa) return null

    const fecha = (str?: string) =>
        str ? format(new Date(str), "dd 'de' MMMM 'de' yyyy", { locale: es }) : "No especificado"

    const renderText = (txt?: string | string[]) => {
        if (!txt) return <p className="text-sm text-muted-foreground">No especificado</p>

        const lines = Array.isArray(txt)
            ? txt
            : typeof txt === "string"
                ? txt.split("\n")
                : []

        if (!lines.length) return <p className="text-sm text-muted-foreground">No especificado</p>

        return (
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {lines.map((line, i) => (
                    <li key={i}>{line}</li>
                ))}
            </ul>
        )
    }

    const handleVerPostulados = async () => {
        try {
            const data = await obtenerPostulacionesDeOferta(Number(params.id))
            setPostulados(data)
            setMostrarPostulados(true)
        } catch (err) {
            console.error("Error al obtener postulados", err)
        }
    }
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8 bg-background rounded-xl p-6 shadow-sm border">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <Avatar className="h-20 w-20 border">
                        <AvatarImage src={empresa.logo || "/placeholder.svg"} />
                        <AvatarFallback>{empresa.nombre[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h1 className="text-3xl font-bold">{oferta.titulo}</h1>
                        <p className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            {empresa.nombre}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                            <Badge>{oferta.estado || "Pendiente"}</Badge>
                            {oferta.estadoPubli && <Badge variant="secondary">{oferta.estadoPubli}</Badge>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Detalles del Puesto</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <DetailItem icon={<Briefcase />} label="Tipo" value={oferta.tipo} />
                            <DetailItem icon={<MapPin />} label="Ubicación" value={oferta.locacion} />
                            <DetailItem icon={<Clock />} label="Horario" value={oferta.horario} />
                            <DetailItem icon={<Users />} label="Modalidad" value={oferta.modalidad} />
                            <DetailItem icon={<GraduationCap />} label="Experiencia" value={oferta.experiencia || "No especificado"} />
                            <DetailItem icon={<DollarSign />} label="Salario" value={oferta.salario ? `S/ ${oferta.salario}` : "No especificado"} />
                        </CardContent>
                    </Card>

                    <Card><CardHeader><CardTitle>Funciones</CardTitle></CardHeader><CardContent>{renderText(oferta.funciones)}</CardContent></Card>
                    <Card><CardHeader><CardTitle>Requisitos</CardTitle></CardHeader><CardContent>{renderText(oferta.requisitos)}</CardContent></Card>
                    <Card><CardHeader><CardTitle>Beneficios</CardTitle></CardHeader><CardContent>{renderText(oferta.beneficios)}</CardContent></Card>

                    <div className="mt-6">
                        <Button variant="outline" onClick={() => router.push(rol == 2 ? "/empresa" : "/admin")}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Información de la Oferta</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p><strong>Fecha Publicación:</strong> {fecha(oferta.fechaPubli)}</p>
                            <p><strong>Fecha Inicio:</strong> {fecha(oferta.fechaInicio)}</p>
                            <p><strong>Fecha Cierre:</strong> {fecha(oferta.fechaCierre)}</p>
                            <p><strong>Vacantes:</strong> {oferta.vacantes}</p>
                            <p><strong>Área:</strong> {oferta.area}</p>
                            <p><strong>Duración:</strong> {oferta.tiempo} meses</p>
                        </CardContent>
                    </Card>

                    {yaRecomendado ? (
                        <div className="space-y-2">
                            <Button className="w-full" onClick={handleVerPostulados}>
                                Ver Egresados Postulados
                            </Button>

                            {mostrarPostulados && (
                                <Card>
                                    <CardHeader><CardTitle>Postulados</CardTitle></CardHeader>
                                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                                        {postulados.length === 0 ? (
                                            <p>No se encontraron postulados.</p>
                                        ) : (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {postulados.map((postulado, index) => (
                                                    <li key={index}>
                                                        {postulado.egresado?.nombres} {postulado.egresado?.apellidos} — Ranking: {postulado.posicionRanking}
                                                    </li>
                                                ))}
                                            </ul>

                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ) : (
                        <Button className="w-full" onClick={() => router.push(`/admin/recomendar/${oferta.id}`)}>
                            Recomendar Egresados
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-start gap-2">
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{value}</p>
            </div>
        </div>
    )
}
