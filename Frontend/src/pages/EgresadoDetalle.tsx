import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    Mail, Phone, MapPin, Calendar, Flag, Github, Linkedin, Download, User, FileText, Award, Briefcase, GraduationCap, CheckCircle, XCircle
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Egresado } from "@/types/Egresado"
import { BackButton } from "@/components/shared/BackButton"

export default function EgresadoDetalle() {
    const { id } = useParams<{ id: string }>()
    const [egresado, setEgresado] = useState<Egresado | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEgresado = async () => {
            const stored = localStorage.getItem("egresados")
            if (stored) {
                const lista = JSON.parse(stored) as Egresado[]
                const encontrado = lista.find(e => String(e.id) === id)
                if (encontrado) {
                    setEgresado(encontrado)
                    setLoading(false)
                    return
                }
            }

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/egresados/${id}`)
                if (!res.ok) throw new Error("Egresado no encontrado")
                const data = await res.json()
                setEgresado(data)

                const nuevos = stored ? JSON.parse(stored) : []
                localStorage.setItem("egresados", JSON.stringify([...nuevos, data]))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchEgresado()
    }, [id])

    if (loading) return <p className="text-muted-foreground">Cargando...</p>
    if (!egresado) return <p className="text-red-500">Egresado no encontrado</p>

    const fechaNacimiento = egresado.fechaNacimiento
        ? format(new Date(egresado.fechaNacimiento), "dd 'de' MMMM 'de' yyyy", { locale: es })
        : "N/A"

    const habilidades = egresado.habilidades?.split(",").map(h => ({
        name: h.trim(),
        proficiency: Math.floor(Math.random() * 30) + 70
    })) || []

    const idiomas = egresado.idiomas?.split(",").map(idioma => {
        const [lang, lvl] = idioma.split("(")
        const level = lvl?.replace(")", "").trim() || "Básico"
        let proficiency = 50
        if (level.includes("Nativo")) proficiency = 100
        else if (level.includes("Avanzado")) proficiency = 90
        else if (level.includes("Intermedio")) proficiency = 70
        else if (level.includes("Básico")) proficiency = 40
        return { language: lang.trim(), level, proficiency }
    }) || []

    const renderList = (text: string) =>
        text?.split("\n").map((item, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{item.replace("- ", "")}</p>
        ))

    const getInitials = () => `${egresado.nombres[0]}${egresado.apellidos[0]}`

    return (
        <div className="container mx-auto py-10">

            <div className="mb-8 bg-background rounded-xl p-6 shadow-sm border">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <Avatar className="h-28 w-28 border-2 border-primary/30 shadow-md">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${egresado.nombres}+${egresado.apellidos}`} />
                        <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold tracking-tight">{egresado.nombres} {egresado.apellidos}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{egresado.email}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                            <Badge variant="outline">{egresado.tipoDoc}: {egresado.numDoc}</Badge>
                            <Badge
                                variant="secondary"
                                className={egresado.disponibilidad ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                                {egresado.disponibilidad ? "Disponible" : "No Disponible"}
                            </Badge>

                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                            {egresado.linkedin && (
                                <Button size="sm" variant="outline" asChild>
                                    <a href={egresado.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        <Linkedin className="mr-1 h-4 w-4" />LinkedIn
                                    </a>
                                </Button>
                            )}
                            {egresado.github && (
                                <Button size="sm" variant="outline" asChild>
                                    <a href={egresado.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        <Github className="mr-1 h-4 w-4" />GitHub
                                    </a>
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="default"
                                asChild
                            >
                                <a
                                    href={egresado.cv || "#"}
                                    onClick={(e) => {
                                        if (!egresado.cv) {
                                            e.preventDefault()
                                            // Aquí podrías lanzar una función que genere el CV dinámicamente.
                                            // O simplemente dejarlo como botón de placeholder por ahora
                                            alert("El CV se generará próximamente.")
                                        }
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                    download
                                >
                                    <Download className="mr-1 h-4 w-4" />
                                    Descargar CV
                                </a>
                            </Button>

                        </div>
                    </div>

                    <div className="hidden md:block">
                        <Card className="w-64 bg-white shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-gray-800">Estado</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-base font-medium text-gray-900">
                                    {egresado.disponibilidad ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span>Disponible para ofertas</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5 text-red-500" />
                                            <span>No disponible actualmente</span>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Información Personal</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p><Mail className="inline w-4 h-4 mr-2" />{egresado.email}</p>
                            <p><Phone className="inline w-4 h-4 mr-2" />{egresado.telefono}</p>
                            {egresado.direccion && <p><MapPin className="inline w-4 h-4 mr-2" />{egresado.direccion}</p>}
                            <p><Calendar className="inline w-4 h-4 mr-2" />{fechaNacimiento}</p>
                            {egresado.nacionalidad && <p><Flag className="inline w-4 h-4 mr-2" />{egresado.nacionalidad}</p>}
                        </CardContent>
                    </Card>

                    {idiomas.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Idiomas</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {idiomas.map((i, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>{i.language}</span>
                                            <span>{i.level}</span>
                                        </div>
                                        <Progress value={i.proficiency} className="h-2" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {habilidades.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Habilidades</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {habilidades.map((h, i) => (
                                    <Badge key={i} variant="secondary">{h.name}</Badge>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Tabs defaultValue="experiencia" className="w-full">
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="experiencia">Experiencia</TabsTrigger>
                            <TabsTrigger value="logros">Logros</TabsTrigger>
                            <TabsTrigger value="certificados">Certificados</TabsTrigger>
                        </TabsList>

                        <TabsContent value="experiencia" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5" />
                                        Experiencia Laboral
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>{renderList(egresado.experienciaLaboral || "")}</CardContent>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5" />
                                        Habilidades Técnicas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {habilidades.map((skill, i) => (
                                            <Badge key={i} variant="secondary">{skill.name}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="logros" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Logros Académicos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>{renderList(egresado.logrosAcademicos || "")}</CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="certificados" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Certificaciones
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>{renderList(egresado.certificados || "")}</CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <Card>
                        <CardHeader><CardTitle>Acciones</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            <Button><Mail className="mr-2 h-4 w-4" />Contactar</Button>
                            <Button variant="outline"><FileText className="mr-2 h-4 w-4" />Ver Postulaciones</Button>
                            <Button variant="outline"><User className="mr-2 h-4 w-4" />Editar Perfil</Button>
                        </CardContent>
                    </Card>
                    <div className="mt-6">
                        <BackButton fallback="/admin/dashboard?tab=egresados" />
                    </div>

                </div>
            </div>
        </div>
    )
}
