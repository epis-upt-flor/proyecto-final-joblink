"use client"

import { useEffect, useState } from "react"
import { Moon, Briefcase, Filter, MoreHorizontal, PlusCircle, Search } from 'lucide-react'
import { useEmpresa } from "@/hooks/useEmpresas"
import { useOfertas, useOfertasPorEmpresa } from "@/hooks/useOfertas"
import { usePostulacionesEmpresa } from "@/hooks/usePostulaciones"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { usePostulacionActions } from "@/hooks/usePostulacionesActions"
import { EditarEmpresaModal } from "@/components/modals/editarEmpresaModal"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AgregarOfertaModal } from "@/components/modals/ofertaModal"

export default function EmpresaPortal() {
    const router = useRouter()
    const [empresaId, setEmpresaId] = useState<number | null>(null)
    const [ready, setReady] = useState(false)
    const [editarModalOpen, setEditarModalOpen] = useState(false)


    const handleVerDetalle = (id: number) => {
        router.push(`/oferta/${id}`);
    };
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const decoded = jwtDecode<{ id: number }>(token)
                    setEmpresaId(decoded.id)
                } catch (err) {
                    console.error("Token inválido", err)
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

    const {
        data: postulaciones,
        isLoading: postulacionesLoading,
        error: postulacionesError,
    } = usePostulacionesEmpresa(empresaId ?? 0, {
        enabled: ready && empresaId !== null,
    })

    const [plazaModalOpen, setPlazaModalOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/auth/login"
    }
    const empresaActual = empresa
    const plazasEmpresa = plazas?.filter((plaza) => plaza.empresa?.id === empresaId) || []
    const toggleTheme = () => {
        const current = localStorage.getItem("theme")
        const newTheme = current === "dark" ? "light" : "dark"
        localStorage.setItem("theme", newTheme)
        window.location.reload()
    }

    const { aprobar, rechazar } = usePostulacionActions(empresaId ?? 0)

    return (
        <div className="min-h-screen bg-muted/40">
            <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">LinkJob</h1>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">Portal Empresarial</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        <Moon className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage
                                    src={empresaActual?.logo || "/placeholder.svg"}
                                    alt={empresaActual?.nombre || "Empresa"}
                                />
                                <AvatarFallback>
                                    {empresaActual?.nombre?.substring(0, 2).toUpperCase() || "EM"}
                                </AvatarFallback>
                            </Avatar>


                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditarModalOpen(true)}>
                                Editar empresa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>

                    </DropdownMenu>
                </div>
            </header>

            <main className="p-4 md:p-6 space-y-6">
                <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Portal Empresarial</h1>
                        <p className="text-muted-foreground">
                            Bienvenido, {empresaActual?.nombre || "Empresa"}.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button onClick={() => setPlazaModalOpen(true)}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Publicar Plaza
                        </Button>
                    </div>
                </section>

                {/* Plazas de la empresa */}
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
                                    <TableHead>Área</TableHead>
                                    <TableHead>Modalidad</TableHead>
                                    <TableHead>Locación</TableHead>
                                    <TableHead>Salario</TableHead>
                                    <TableHead>Vacantes</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {plazasLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">Cargando plazas...</TableCell>
                                    </TableRow>
                                ) : plazasEmpresa.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">No hay plazas disponibles</TableCell>
                                    </TableRow>
                                ) : (
                                    plazasEmpresa.map((plaza) => (
                                        <TableRow key={plaza.id}>
                                            <TableCell className="font-medium">{plaza.titulo}</TableCell>
                                            <TableCell>{plaza.area}</TableCell>
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
                                                        : plaza.estadoPubli === "NO_PUBLICADA"
                                                            ? "destructive"
                                                            : "outline"
                                                }>
                                                    {plaza.estadoPubli}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" onClick={() => handleVerDetalle(plaza.id)}>
                                                    Ver detalle
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                        </Table>
                    </CardContent>
                </Card>

                {/* Postulaciones */}
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
                                        <TableCell colSpan={5} className="text-center">Cargando postulaciones...</TableCell>
                                    </TableRow>
                                ) : postulacionesError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-red-500">Error al cargar postulaciones</TableCell>
                                    </TableRow>
                                ) : postulaciones && postulaciones.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">No hay postulaciones</TableCell>
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
                                                    {p.egresado.nombres} {p.egresado.apellidos}
                                                </div>
                                            </TableCell>
                                            <TableCell>{p.oferta.titulo}</TableCell>
                                            <TableCell>{new Date(p.fechaRecomendacion).toLocaleDateString()}</TableCell>
                                            <TableCell>{p.posicionRanking ?? "—"}</TableCell>
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
                                                        {aprobar.isPending ? "Aceptando..." : "Aceptar"}
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => rechazar.mutate(p.id)}
                                                        disabled={rechazar.isPending}
                                                    >
                                                        {rechazar.isPending ? "Rechazando..." : "Rechazar"}
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
            </main>

            {/* Modal para agregar plaza */}
            <AgregarOfertaModal
                open={plazaModalOpen}
                onOpenChange={setPlazaModalOpen}
                onSuccess={() => console.log("Plaza agregada exitosamente")}
            />
            {empresaActual && (
                <EditarEmpresaModal
                    open={editarModalOpen}
                    onOpenChange={setEditarModalOpen}
                    empresa={empresaActual}
                    onSuccess={() => {
                        toast.success("Empresa actualizada")
                        window.location.reload()
                    }}
                />
            )}

        </div>
    )
}
