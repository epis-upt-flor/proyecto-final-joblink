'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { fetchEgresado } from "@/api/egresadoApi"
import {
    Mail, Phone, MapPin, Calendar, Flag, Github, Linkedin, Download, ArrowLeft,
    CheckCircle, XCircle, FileText, Briefcase, Award, GraduationCap
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { jwtDecode } from "jwt-decode"

export default function EgresadoDetallePage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [egresado, setEgresado] = useState<any | null>(null)

    const [rol, setRol] = useState<number | null>(null)

    useEffect(() => {
        const load = async () => {
            const id = Number(params.id)
            if (isNaN(id)) return router.push("/not-found")

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
                        console.error("Error decodificando token:", err)
                    }
                }
            }

            try {
                const data = await fetchEgresado(id)
                setEgresado(data)
            } catch {
                router.push("/not-found")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [params.id, router])

    console.log(rol)

    const formatDate = (str: string) => format(new Date(str), "dd 'de' MMMM 'de' yyyy", { locale: es })
    const getInitials = () => `${egresado?.nombres[0]}${egresado?.apellidos[0]}`

    if (loading) return <p className="text-muted-foreground">Cargando...</p>
    if (!egresado) return null

    return (
        <div className="container mx-auto py-10">
            {/* Header */}
            <div className="mb-8 bg-background rounded-xl p-6 shadow-sm border flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-28 w-28 border-2 border-primary/30 shadow-md">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${egresado.nombres}+${egresado.apellidos}`} />
                    <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-3">
                    <h1 className="text-3xl font-bold">{egresado.nombres} {egresado.apellidos}</h1>
                    <p className="text-sm text-muted-foreground">{egresado.email}</p>
                    <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                        <Badge variant="outline">{egresado.tipoDoc}: {egresado.numDoc}</Badge>
                        <Badge className={egresado.disponibilidad ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {egresado.disponibilidad ? "Disponible" : "No disponible"}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {egresado.linkedin && (
                            <Button size="sm" variant="outline" asChild>
                                <a href={egresado.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="mr-1 h-4 w-4" /> LinkedIn
                                </a>
                            </Button>
                        )}
                        {egresado.github && (
                            <Button size="sm" variant="outline" asChild>
                                <a href={egresado.github} target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-1 h-4 w-4" /> GitHub
                                </a>
                            </Button>
                        )}
                        {egresado.cv && (
                            <Button size="sm" variant="default" asChild>
                                <a href={egresado.cv} target="_blank" rel="noopener noreferrer" download>
                                    <Download className="mr-1 h-4 w-4" /> Descargar CV
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Side */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Información Personal</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p><Mail className="inline w-4 h-4 mr-2" />{egresado.email}</p>
                            <p><Phone className="inline w-4 h-4 mr-2" />{egresado.telefono}</p>
                            {egresado.direccion && <p><MapPin className="inline w-4 h-4 mr-2" />{egresado.direccion}</p>}
                            <p><Calendar className="inline w-4 h-4 mr-2" />{formatDate(egresado.fechaNacimiento)}</p>
                            {egresado.nacionalidad && <p><Flag className="inline w-4 h-4 mr-2" />{egresado.nacionalidad}</p>}
                        </CardContent>
                    </Card>

                    {/* Idiomas */}
                    {egresado.idiomas?.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Idiomas</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {egresado.idiomas.map((i: any, idx: number) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>{i.idioma}</span>
                                            <span>{i.nivel}</span>
                                        </div>
                                        <Progress value={80} className="h-2" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Habilidades */}
                    {egresado.habilidades?.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Habilidades</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {egresado.habilidades.map((h: string, i: number) => (
                                    <Badge key={i} variant="secondary">{h}</Badge>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Side */}
                <div className="md:col-span-2 space-y-6">
                    <Tabs defaultValue="experiencia">
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="experiencia">Experiencia</TabsTrigger>
                            <TabsTrigger value="logros">Logros</TabsTrigger>
                            <TabsTrigger value="certificados">Certificados</TabsTrigger>
                        </TabsList>

                        <TabsContent value="experiencia" className="mt-4">
                            <Card>
                                <CardHeader><CardTitle><Briefcase className="h-5 w-5 inline mr-2" />Experiencia Laboral</CardTitle></CardHeader>
                                <CardContent>
                                    {egresado.experienciaLaboral?.length > 0 ? (
                                        egresado.experienciaLaboral.map((exp: any, idx: number) => (
                                            <p key={idx} className="text-sm text-muted-foreground mb-2">
                                                <strong>{exp.puesto}</strong> en <strong>{exp.empresa}</strong> ({exp.periodo})
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No especificado</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="logros" className="mt-4">
                            <Card>
                                <CardHeader><CardTitle><Award className="h-5 w-5 inline mr-2" />Logros Académicos</CardTitle></CardHeader>
                                <CardContent>
                                    {egresado.logrosAcademicos?.length ? (
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            {egresado.logrosAcademicos.map((l: string, i: number) => (
                                                <li key={i}>{l}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No especificado</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="certificados" className="mt-4">
                            <Card>
                                <CardHeader><CardTitle><FileText className="h-5 w-5 inline mr-2" />Certificados</CardTitle></CardHeader>
                                <CardContent>
                                    {egresado.certificados?.length ? (
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            {egresado.certificados.map((c: string, i: number) => (
                                                <li key={i}>{c}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No especificado</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6">
                        <Button
                            variant="outline"
                            onClick={() => router.push(rol == 2 ? "/empresa" : "/admin")}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    )
}
