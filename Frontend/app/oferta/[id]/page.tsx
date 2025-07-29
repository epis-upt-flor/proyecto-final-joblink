"use client"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { motion } from "framer-motion"
import {
    Building2, MapPin, Clock, Users, Briefcase, 
    GraduationCap, DollarSign, ArrowLeft, Settings, 
    LogOut, ChevronDown
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { obtenerOferta, obtenerPostulacionesDeOferta } from "@/api/ofertaApi"
import { fetchEmpresa } from "@/api/empresaApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import LogoWithThemeEmpresa from "@/components/logo-theme-empresa"
import Loading from "./loading"
import LogoWithThemeAdmin from "@/components/logo-theme-admin"
import { CheckCircle, X, UserCheck } from "lucide-react"
import { ConfirmRecommendModal } from "@/components/modals/ConfirmRecommendModal"

export default function OfertaDetallePage() {
    const params = useParams()
    const router = useRouter()
    const [oferta, setOferta] = useState<any | null>(null)
    const [empresa, setEmpresa] = useState<any | null>(null)
    const [empresaActual, setEmpresaActual] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [yaRecomendado, setYaRecomendado] = useState(false)
    const [mostrarPostulados, setMostrarPostulados] = useState(false)
    const [postulados, setPostulados] = useState<any[]>([])
    const [rol, setRol] = useState<number | null>(null)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isRecommending, setIsRecommending] = useState(false)

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const getData = async () => {
        try {
        const id = Number(params.id)
        if (isNaN(id)) return
        
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token")
            if (token) {
            try {
                interface DecodedToken {
                role: string;
                id: string;
                [key: string]: any
                }
                const decoded = jwtDecode<DecodedToken>(token)
                setRol(Number(decoded.role))
                
                // Solo obtener empresa actual si el rol es 2 (empresa)
                if (Number(decoded.role) === 2 && decoded.id) {
                const empresaData = await fetchEmpresa(Number(decoded.id))
                setEmpresaActual(empresaData)
                }
            } catch (err) {
                console.error("Error al decodificar token:", err)
            }
            }
        }
        
        const fetchedOferta = await obtenerOferta(id)
        setOferta(fetchedOferta)

        // Obtener empresa de la oferta
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

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/auth/login")
    }

    if (loading) return <Loading />
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
        <div className="min-h-screen flex flex-col">
            <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
            {rol === 2 ? (
                // Header para empresa (rol 2)
                <>
                <div className="flex items-center gap-4">
                    <LogoWithThemeEmpresa />
                    <span className="hidden md:inline text-muted-foreground">|</span>
                    <span className="hidden md:inline text-muted-foreground">Portal Empresarial</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={empresaActual?.logo || "/placeholder.svg"}
                                        alt={empresaActual?.nombre || "Empresa"}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {empresaActual?.nombre?.substring(0, 2).toUpperCase() || "EM"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Empresa</p>
                                    <p className="text-xs leading-none text-muted-foreground">Perfil Empresarial</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={handleLogout}
                                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                </>
            ) : (
                // Header para admin (rol 1)
                <>
                <div className="flex items-center gap-4">
                    <LogoWithThemeAdmin />
                </div>
                
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8 border-2 border-primary/20 hover:border-primary/40 transition-all">
                            <AvatarImage 
                            src="/admin-avatar.png" 
                            alt="Admin"
                            className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white">
                            <span className="animate-pulse">AD</span>
                            </AvatarFallback>
                        </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Administrador</p>
                            <p className="text-xs leading-none text-muted-foreground">Perfil Administrativo</p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                </>
            )}
            </header>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 container mx-auto py-8 px-4 md:px-6"
            >
                {/* Encabezado de la oferta */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 bg-background rounded-xl p-6 shadow-sm border"
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Avatar className="h-24 w-24 border-2 border-primary/20">
                            <AvatarImage src={empresa.logo || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {empresa.nombre.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">{oferta.titulo}</h1>
                                    <p className="flex items-center gap-2 text-muted-foreground mt-1">
                                        <Building2 className="h-4 w-4" />
                                        {empresa.nombre}
                                    </p>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="border-primary/30 text-primary">
                                        {oferta.estado || "Pendiente"}
                                    </Badge>
                                    {oferta.estadoPubli && (
                                        <Badge variant="secondary">
                                            {oferta.estadoPubli}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{oferta.locacion || "No especificado"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span>{oferta.tipo || "No especificado"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{oferta.horario || "No especificado"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span>{oferta.salario ? `S/ ${oferta.salario}` : "No especificado"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Detalles principales */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Sección de Funciones */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                        Funciones del Puesto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderText(oferta.funciones)}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Sección de Requisitos */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-primary" />
                                        Requisitos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderText(oferta.requisitos)}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Sección de Beneficios */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        Beneficios
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderText(oferta.beneficios)}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Columna derecha - Información adicional */}
                    <div className="space-y-6">
                        {/* Información de la oferta */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Detalles de la Oferta
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Publicación:</span>
                                        <span>{fecha(oferta.fechaPubli)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Inicio:</span>
                                        <span>{fecha(oferta.fechaInicio)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cierre:</span>
                                        <span>{fecha(oferta.fechaCierre)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Vacantes:</span>
                                        <span>{oferta.vacantes}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Área:</span>
                                        <span>{oferta.area}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Duración:</span>
                                        <span>{oferta.tiempo} meses</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Modalidad:</span>
                                        <span>{oferta.modalidad}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Experiencia:</span>
                                        <span>{oferta.experiencia || "No especificado"}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Acciones */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <Button 
                                variant="outline" 
                                className="w-full" 
                                onClick={() => router.push(rol === 2 ? "/empresa" : "/admin")}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                            </Button>

                            {yaRecomendado ? (
                                <div className="space-y-3">
                                    <Button 
                                        className="w-full" 
                                        onClick={handleVerPostulados}
                                        variant="outline"
                                    >
                                        Ver Postulantes
                                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${mostrarPostulados ? "rotate-180" : ""}`} />
                                    </Button>

                                    {mostrarPostulados && (
                                        <Card className="border-border/50">
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-base">Egresados Postulados</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3 text-sm">
                                                {postulados.length === 0 ? (
                                                    <p className="text-muted-foreground text-center py-4">No se encontraron postulados.</p>
                                                ) : (
                                                    <ul className="space-y-3">
                                                        {postulados.map((postulado, index) => (
                                                            <li key={index} className="flex items-start gap-3 p-3 bg-muted/10 rounded-lg">
                                                                <Avatar className="h-9 w-9 border">
                                                                    <AvatarImage src={postulado.egresado?.foto || "/placeholder-user.jpg"} />
                                                                    <AvatarFallback>
                                                                        {postulado.egresado?.nombres?.charAt(0)}{postulado.egresado?.apellidos?.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <p className="font-medium">
                                                                        {postulado.egresado?.nombres} {postulado.egresado?.apellidos}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Ranking: <span className="text-primary">{postulado.posicionRanking}</span>
                                                                    </p>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            ) : (
                                rol === 1 && oferta.estado === "ACTIVA" && oferta.estadoPubli === "PUBLICADA" && (
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button 
                                        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                                        onClick={() => setIsConfirmModalOpen(true)}
                                        >
                                        Recomendar Egresados
                                        </Button>
                                    </motion.div>
                                )
                            )}
                        </motion.div>
                    </div>
                        <ConfirmRecommendModal
                        isOpen={isConfirmModalOpen}
                        onClose={() => setIsConfirmModalOpen(false)}
                        onConfirm={async () => {
                            setIsRecommending(true)
                            try {
                            await router.push(`/admin/recomendar/${oferta.id}`)
                            } finally {
                            setIsRecommending(false)
                            setIsConfirmModalOpen(false)
                            }
                        }}
                        loading={isRecommending}
                        offerTitle={oferta.titulo}
                        />
                </div>
            </motion.div>
        </div>
    )
}

