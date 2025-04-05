"use client"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom" // Si usás React Router
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { getRoleFromToken } from "@/helpers/auth"
import {
    Building2,
    MapPin,
    Clock,
    Users,
    Briefcase,
    GraduationCap,
    DollarSign,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Empresa {
    id: number
    nombre: string
    logo?: string
}

interface Oferta {
    id: number
    titulo: string
    tipo: string
    area: string
    modalidad: string
    horario: string
    vacantes: number
    experiencia: boolean | string
    locacion: string
    salario?: number
    funciones: string
    requisitos: string
    beneficios?: string
    fechaInicio: string
    tiempo: number
    estado?: string
    estadoPubli?: string | null
    motivo?: string | null
    fechaPubli?: string
    fechaCierre?: string | null
    idEmpresa: number
}

export default function OfertaDetalle() {
    const { id } = useParams()
    const [oferta, setOferta] = useState<Oferta | null>(null)
    const [empresa, setEmpresa] = useState<Empresa | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!id) return

        const ofertasRaw = localStorage.getItem("ofertas")
        const empresasRaw = localStorage.getItem("empresas")

        if (!ofertasRaw || !empresasRaw) return

        const ofertas: Oferta[] = JSON.parse(ofertasRaw)
        const empresas: Empresa[] = JSON.parse(empresasRaw)

        const encontrada = ofertas.find((o) => o.id === Number(id))
        if (!encontrada) return

        const empresaOferta = empresas.find((e) => e.id === encontrada.idEmpresa)

        setOferta(encontrada)
        setEmpresa(empresaOferta || null)
    }, [id])


    if (!oferta || !empresa) return <p className="text-center">Cargando oferta...</p>

    const fechaInicio = format(new Date(oferta.fechaInicio), "dd 'de' MMMM 'de' yyyy", { locale: es })
    const fechaPubli = oferta.fechaPubli
        ? format(new Date(oferta.fechaPubli), "dd 'de' MMMM 'de' yyyy")
        : "No publicado"

    const fechaCierre = oferta.fechaCierre
        ? format(new Date(oferta.fechaCierre), "dd 'de' MMMM 'de' yyyy", { locale: es })
        : "No especificado"

    const renderText = (txt?: string) => txt?.split("\n").map((l, i) => <p key={i}>{l}</p>)

    return (
        <div className="container py-10 mx-auto">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">{oferta.titulo}</h1>
                            <div className="flex items-center text-muted-foreground mt-2">
                                <Building2 className="h-4 w-4 mr-2" />
                                <span>{empresa.nombre}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge>{oferta.estado || "pendiente"}</Badge>
                            {oferta.estadoPubli && <Badge variant="secondary">{oferta.estadoPubli}</Badge>}
                        </div>
                    </div>

                    <Separator />

                    <Card>
                        <CardHeader><CardTitle>Detalles del Puesto</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem icon={<Briefcase />} label="Tipo" value={oferta.tipo} />
                            <DetailItem icon={<MapPin />} label="Ubicación" value={oferta.locacion} />
                            <DetailItem icon={<Clock />} label="Horario" value={oferta.horario} />
                            <DetailItem icon={<Users />} label="Modalidad" value={oferta.modalidad} />
                            <DetailItem icon={<GraduationCap />} label="Experiencia" value={oferta.experiencia === "true" || oferta.experiencia === true ? "Sí" : "No"} />
                            <DetailItem icon={<DollarSign />} label="Salario" value={oferta.salario ? `S/ ${oferta.salario}` : "No especificado"} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Funciones</CardTitle></CardHeader>
                        <CardContent>{renderText(oferta.funciones)}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Requisitos</CardTitle></CardHeader>
                        <CardContent>{renderText(oferta.requisitos)}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Beneficios</CardTitle></CardHeader>
                        <CardContent>{renderText(oferta.beneficios)}</CardContent>
                    </Card>
                    <div className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const role = getRoleFromToken()
                                if (role === "admin") {
                                    navigate("/admin/dashboard")
                                } else if (role === "empresa") {
                                    navigate("/empresa/dashboard")
                                } else {
                                    navigate("/")
                                }
                            }}
                        >
                            ← Volver
                        </Button>
                    </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            {/* Logo */}
                            <div className="relative h-14 w-14 rounded-md overflow-hidden border">
                                <img
                                    src={empresa.logo || "/placeholder.svg"}
                                    alt={empresa.nombre}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            {/* Info de la empresa */}
                            <div>
                                <CardTitle className="text-base">{empresa.nombre}</CardTitle>
                                <CardDescription>Empresa</CardDescription>
                            </div>
                        </CardHeader>

                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Información de la Oferta</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Fecha Publicación:</strong> {fechaPubli}</p>
                            <p><strong>Fecha Inicio:</strong> {fechaInicio}</p>
                            <p><strong>Fecha Cierre:</strong> {fechaCierre}</p>
                            <p><strong>Vacantes:</strong> {oferta.vacantes}</p>
                            <p><strong>Área:</strong> {oferta.area}</p>
                            <p><strong>Duración:</strong> {oferta.tiempo} meses</p>
                        </CardContent>
                    </Card>
                    <Button className="w-full" onClick={() => { }}>
                        Recomendar Egresados
                    </Button>
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
                <p>{value}</p>
            </div>
        </div>
    )
}
