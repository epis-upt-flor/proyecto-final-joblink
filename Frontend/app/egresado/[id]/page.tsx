'use client'

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { jwtDecode } from "jwt-decode"
import { fetchEgresado } from "@/api/egresadoApi"
import {
  Mail, Phone, MapPin, Calendar, Flag, Github, Linkedin, Download, ArrowLeft,
  CheckCircle, XCircle, FileText, Briefcase, Award, ScrollText, User, BookOpen, LogOut, Trophy
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Loading from "./loading"
import { ThemeToggle } from "@/components/theme-toggle"
import LogoWithThemeAdmin from "@/components/logo-theme-admin"
import LogoWithThemeEmpresa from "@/components/logo-theme-empresa"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { fetchEmpresa } from "@/api/empresaApi"

export default function EgresadoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [egresado, setEgresado] = useState<any | null>(null)
  const [rol, setRol] = useState<number | null>(null)
  const [empresaActual, setEmpresaActual] = useState<any | null>(null)
  const [ready, setReady] = useState(false)

  // Type definitions
  type Empresa = {
    id: number
    nombre: string
    ruc: string
    telefono: string
    logo?: string
    estado: boolean
  }

  useEffect(() => {
    const load = async () => {
      const id = Number(params.id)
      if (isNaN(id)) return router.push("/not-found")

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
        if (token) {
          try {
            interface DecodedToken {
              role: string
              id: string
              [key: string]: any
            }
            const decoded = jwtDecode<DecodedToken>(token)
            setRol(Number(decoded.role))
            
            // Solo obtener empresa actual si el rol es 2 (empresa)
            if (Number(decoded.role) === 2 && decoded.id) {
              try {
                const empresaData = await fetchEmpresa(Number(decoded.id))
                setEmpresaActual(empresaData)
              } catch (error) {
                console.error("Error obteniendo datos de empresa:", error)
                toast.error("Error al cargar datos de la empresa")
              }
            }
          } catch (err) {
            console.error("Error decodificando token:", err)
            toast.error("Error de autenticación")
          }
        }
        setReady(true)
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

  const formatDate = (str?: string | null) => {
    if (!str) return "Fecha no disponible"
    const fecha = new Date(str)
    if (isNaN(fecha.getTime())) return "Fecha inválida"
    return format(fecha, "dd 'de' MMMM 'de' yyyy", { locale: es })
    }

  const getInitials = () => `${egresado?.nombres[0]}${egresado?.apellidos[0]}`

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/auth/login")
  }

  const getProgressValue = (nivel: string): number => {
    const levels: Record<string, number> = {
      'BÁSICO': 30,
      'INTERMEDIO': 60,
      'AVANZADO': 85,
      'NATIVO': 100
    }
    return levels[nivel.toUpperCase()] || 50
  }

  if (loading) return <Loading />
  if (!egresado) return null

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header condicional */}
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
                            className="object-cover"
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
                {/* Header del egresado */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 bg-background rounded-xl p-6 shadow-sm border flex flex-col md:flex-row gap-6 items-center md:items-start"
                >
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Avatar className="h-28 w-28 border-2 border-primary/30 shadow-md">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${egresado.nombres}+${egresado.apellidos}&background=random`} />
                            <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-secondary text-white">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                    </motion.div>

                    <div className="flex-1 text-center md:text-left space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight">{egresado.nombres} {egresado.apellidos}</h1>
                        <p className="text-sm text-muted-foreground">{egresado.email}</p>
                        
                        <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                            <Badge variant="outline" className="font-mono">{egresado.tipoDoc}: {egresado.numDoc}</Badge>
                            <Badge 
                                className={egresado.disponibilidad ? 
                                    "bg-green-100 text-green-800 hover:bg-green-100" : 
                                    "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                            >
                                {egresado.disponibilidad ? (
                                    <span className="flex items-center gap-1">
                                        <CheckCircle className="h-4 w-4" /> Disponible
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <XCircle className="h-4 w-4" /> No disponible
                                    </span>
                                )}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {egresado.linkedin && (
                                <motion.div whileHover={{ y: -2 }}>
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={egresado.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Linkedin className="mr-1 h-4 w-4" /> LinkedIn
                                        </a>
                                    </Button>
                                </motion.div>
                            )}
                            {egresado.github && (
                                <motion.div whileHover={{ y: -2 }}>
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={egresado.github} target="_blank" rel="noopener noreferrer">
                                            <Github className="mr-1 h-4 w-4" /> GitHub
                                        </a>
                                    </Button>
                                </motion.div>
                            )}
                            {egresado.cv && (
                                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="sm" variant="default" asChild>
                                        <a href={egresado.cv} target="_blank" rel="noopener noreferrer" download>
                                            <Download className="mr-1 h-4 w-4" /> Descargar CV
                                        </a>
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Side - 1 col */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        Información Personal
                                    </CardTitle>
                                    <br></br>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <p className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{egresado.email}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{egresado.telefono || "No especificado"}</span>
                                    </p>
                                    {egresado.direccion && (
                                        <p className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>{egresado.direccion}</span>
                                        </p>
                                    )}
                                    <p className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{formatDate(egresado.fechaNacimiento)}</span>
                                    </p>
                                    {egresado.nacionalidad && (
                                        <p className="flex items-center gap-2">
                                            <Flag className="h-4 w-4 text-muted-foreground" />
                                            <span>{egresado.nacionalidad}</span>
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Idiomas */}
                        {egresado.idiomas?.length > 0 && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card className="border-border/50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                            Idiomas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {egresado.idiomas.map((i: any, idx: number) => (
                                            <div key={idx}>
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>{i.idioma}</span>
                                                    <span className="text-primary">{i.nivel}</span>
                                                </div>
                                                <Progress 
                                                    value={getProgressValue(i.nivel)} 
                                                    className="h-2 bg-muted"
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Habilidades */}
                        {egresado.habilidades?.length > 0 && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                            </motion.div>
                        )}
                    </div>

                    {/* Right Side - 3 cols */}
                    <div className="lg:col-span-3 space-y-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Tabs defaultValue="experiencia" className="w-full">
                        <TabsList className="grid grid-cols-4 w-full bg-muted/50 rounded-xl overflow-hidden">
                            <TabsTrigger value="experiencia" className="flex items-center justify-center gap-2 py-2">
                            <Briefcase className="h-4 w-4" /> Experiencia
                            </TabsTrigger>
                            <TabsTrigger value="habilidades" className="flex items-center justify-center gap-2 py-2">
                            <Award className="h-4 w-4" /> Habilidades
                            </TabsTrigger>
                            <TabsTrigger value="certificados" className="flex items-center justify-center gap-2 py-2">
                            <FileText className="h-4 w-4" /> Certificados
                            </TabsTrigger>
                            <TabsTrigger value="logros" className="flex items-center justify-center gap-2 py-2">
                            <Trophy className="h-4 w-4" /> Logros
                            </TabsTrigger>
                        </TabsList>

                        {/* EXPERIENCIA */}
                        <TabsContent value="experiencia" className="mt-4">
                            <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Experiencia Laboral
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {egresado.experienciaLaboral?.length > 0 ? (
                                egresado.experienciaLaboral.map((exp: any, idx: number) => (
                                    <div key={idx} className="border-l-2 border-primary/30 pl-4 py-2">
                                    <h3 className="font-semibold">{exp.puesto}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {exp.empresa} • {exp.periodo}
                                    </p>
                                    {exp.descripcion && (
                                        <p className="text-sm text-muted-foreground mt-1">{exp.descripcion}</p>
                                    )}
                                    </div>
                                ))
                                ) : (
                                <p className="text-sm text-muted-foreground">No hay experiencia registrada</p>
                                )}
                            </CardContent>
                            </Card>
                        </TabsContent>

                        {/* HABILIDADES */}
                        <TabsContent value="habilidades" className="mt-4">
                            <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-primary" />
                                Habilidades Técnicas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {egresado.habilidades?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {egresado.habilidades.map((habilidad: string, index: number) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="px-3 py-1 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        {habilidad}
                                    </Badge>
                                    ))}
                                </div>
                                ) : (
                                <p className="text-sm text-muted-foreground">No se han registrado habilidades técnicas</p>
                                )}
                            </CardContent>
                            </Card>
                        </TabsContent>

                        {/* CERTIFICADOS */}
                        <TabsContent value="certificados" className="mt-4">
                            <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Certificaciones y Cursos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {egresado.certificados?.length ? (
                                <ul className="space-y-3">
                                    {egresado.certificados.map((certificado: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle className="w-4 h-4 text-gray-400" />
                                        {certificado}
                                    </li>
                                    ))}
                                </ul>
                                ) : (
                                <p className="text-sm text-muted-foreground">No hay certificados registrados</p>
                                )}
                            </CardContent>
                            </Card>
                        </TabsContent>

                        {/* LOGROS */}
                        <TabsContent value="logros" className="mt-4">
                            <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-primary" />
                                Logros Académicos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {egresado.logrosAcademicos?.length > 0 ? (
                                <ul className="space-y-2">
                                    {egresado.logrosAcademicos.map((logro: string, idx: number) => (
                                    <li
                                        key={idx}
                                        className="text-sm text-muted-foreground flex items-center gap-2"
                                    >
                                        <span className="text-gray-400">✔</span> {logro}
                                    </li>
                                    ))}
                                </ul>
                                ) : (
                                <p className="text-sm text-muted-foreground">No se han registrado logros académicos</p>
                                )}
                            </CardContent>
                            </Card>
                        </TabsContent>
                        </Tabs>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-end"
                    >
                        <Button
                        variant="outline"
                        onClick={() => router.push(rol === 2 ? "/empresa" : "/admin")}
                        >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                        </Button>
                    </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// Función auxiliar para convertir nivel de idioma a valor de progreso
function getProgressValue(nivel: string): number {
    const levels: Record<string, number> = {
        'BÁSICO': 30,
        'INTERMEDIO': 60,
        'AVANZADO': 85,
        'NATIVO': 100
    }
    return levels[nivel.toUpperCase()] || 50
}