"use client"

import { useEffect, useState } from "react"
import { Briefcase, Filter, MoreHorizontal, PlusCircle, LogOut, ArrowLeft, Settings } from 'lucide-react'
import { useEmpresa } from "@/hooks/useEmpresas"
import { useOfertas, useOfertasPorEmpresa } from "@/hooks/useOfertas"
import { usePostulacionesEmpresa } from "@/hooks/usePostulaciones"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { usePostulacionActions } from "@/hooks/usePostulacionesActions"
import { EditarEmpresaModal } from "@/components/modals/editarEmpresaModal"
import { motion } from "framer-motion"
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AgregarOfertaModal } from "@/components/modals/ofertaModal"
import LogoWithThemeEmpresa from "@/components/logo-theme-empresa"
import { ThemeToggle } from "@/components/theme-toggle"
import withAuth from "@/components/hoc/withAuth"

function EmpresaPortal() {
    const router = useRouter()
    const [empresaId, setEmpresaId] = useState<number | null>(null)
    const [ready, setReady] = useState(false)
    const [editarModalOpen, setEditarModalOpen] = useState(false)
    const [plazaModalOpen, setPlazaModalOpen] = useState(false)

    const handleVerDetalle = (id: number) => {
        router.push(`/oferta/${id}`)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const decoded = jwtDecode<{ id: number }>(token)
                    setEmpresaId(decoded.id)
                } catch (err) {
                    console.error("Token inválido", err)
                    toast.error("Error de autenticación")
                }
            }
            setReady(true)
        }
    }, [])

    type Empresa = {
        id: number
        nombre: string
        ruc: string
        telefono: string
        logo?: string
        estado: boolean
    }

    const { data: empresa } = useEmpresa(empresaId!) as { data: Empresa | undefined }
    const { data: plazas, isLoading: plazasLoading } = useOfertasPorEmpresa(empresaId!)
    const { data: postulaciones, isLoading: postulacionesLoading, error: postulacionesError } = usePostulacionesEmpresa(empresaId ?? 0, {
        enabled: ready && empresaId !== null,
    })

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/auth/login"
    }

    const empresaActual = empresa
    const plazasEmpresa = plazas?.filter((plaza) => plaza.empresa?.id === empresaId) || []
    const { aprobar, rechazar } = usePostulacionActions(empresaId ?? 0)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-muted/40"
        >
            {/* Header Mejorado */}
            <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setEditarModalOpen(true)}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Actualizar datos</span>
                            </DropdownMenuItem>
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
            </header>

            <main className="p-4 md:p-6 space-y-6">
                {/* Sección de Bienvenida */}
                <motion.section
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Panel de Gestión Empresarial</h1>
                        <p className="text-muted-foreground mt-2">
                            Bienvenido, <span className="font-medium text-primary">{empresaActual?.nombre || "..."}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button 
                            onClick={() => setPlazaModalOpen(true)}
                            className="gap-2"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Publicar Plaza
                        </Button>
                    </div>
                </motion.section>

                {/* Plazas de la empresa */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Mis Plazas de Trabajo</CardTitle>
                            <CardDescription>Gestione las plazas publicadas por su empresa.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Modalidad</TableHead>
                                        <TableHead>Locación</TableHead>
                                        <TableHead>Salario</TableHead>
                                        <TableHead>Vacantes</TableHead>
                                        <TableHead>Estado de Publicación</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {plazasLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center h-24">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                    Cargando plazas...
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : plazasEmpresa.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                                No hay plazas disponibles
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        plazasEmpresa.map((plaza) => (
                                            <TableRow key={plaza.id}>
                                                <TableCell className="font-medium">{plaza.titulo}</TableCell>
                                                <TableCell>{plaza.modalidad}</TableCell>
                                                <TableCell>{plaza.locacion}</TableCell>
                                                <TableCell>
                                                    {plaza.salario ? `S./${Number(plaza.salario).toLocaleString()}` : "-"}
                                                </TableCell>
                                                <TableCell>{plaza.vacantes}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        plaza.estadoPubli === "PUBLICADA"
                                                            ? "default"
                                                            : plaza.estadoPubli === "NO PUBLICADA"
                                                                ? "destructive"
                                                                : "outline"
                                                    }>
                                                        {plaza.estadoPubli.replace("_", " ")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${
                                                        plaza.estado === "ACTIVA"
                                                        ? "bg-green-100 text-green-800"
                                                        : plaza.estado === "PENDIENTE"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : plaza.estado === "CERRADA"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-muted text-muted-foreground"
                                                    }`}
                                                >
                                                    {plaza.estado}
                                                </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleVerDetalle(plaza.id)}
                                                        >
                                                            Ver detalle
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Postulaciones */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Egresados Postulados</CardTitle>
                            <CardDescription>Lista de egresados postulados a sus plazas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Egresado</TableHead>
                                        <TableHead>Plaza</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Ranking</TableHead>
                                        <TableHead>Habilidades</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {postulacionesLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                    Cargando postulaciones...
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : postulacionesError ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-destructive">
                                                Error al cargar postulaciones
                                            </TableCell>
                                        </TableRow>
                                    ) : postulaciones && postulaciones.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                No hay postulaciones
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        postulaciones?.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            {p.egresado.avatar ? (
                                                                <AvatarImage src={p.egresado.avatar} />
                                                            ) : (
                                                                <AvatarFallback>
                                                                    {p.egresado.nombres?.[0]}
                                                                    {p.egresado.apellidos?.[0]}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <span className="font-medium">{p.egresado.nombres} {p.egresado.apellidos}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{p.oferta.titulo}</TableCell>
                                                <TableCell>{new Date(p.fechaRecomendacion).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    {p.posicionRanking ? (
                                                        <Badge variant="outline">Top {p.posicionRanking}</Badge>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {(p.egresado.habilidades || []).slice(0, 3).map((h, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs">{h}</Badge>
                                                        ))}
                                                        {(p.egresado.habilidades?.length || 0) > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{p.egresado.habilidades.length - 3} más
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/egresado/${p.egresado.id}`)}
                                                        >
                                                            Ver perfil
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => aprobar.mutate(p.id)}
                                                            disabled={aprobar.isPending}
                                                        >
                                                            {aprobar.isPending ? (
                                                                <span className="flex items-center gap-1">
                                                                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                                                                    Aceptando...
                                                                </span>
                                                            ) : "Aceptar"}
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => rechazar.mutate(p.id)}
                                                            disabled={rechazar.isPending}
                                                        >
                                                            {rechazar.isPending ? (
                                                                <span className="flex items-center gap-1">
                                                                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                                                                    Rechazando...
                                                                </span>
                                                            ) : "Rechazar"}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            {/* Modals */}
            <AgregarOfertaModal
                open={plazaModalOpen}
                onOpenChange={setPlazaModalOpen}
                onSuccess={() => toast.success("Plaza publicada exitosamente")}
            />
            
            {empresaActual && (
                <EditarEmpresaModal
                    open={editarModalOpen}
                    onOpenChange={setEditarModalOpen}
                    empresa={empresaActual}
                    onSuccess={() => {
                        toast.success("Información de la empresa actualizada")
                    }}
                />
            )}
        </motion.div>
    )
}

export default withAuth(EmpresaPortal, ["2"])