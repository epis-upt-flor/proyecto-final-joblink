"use client"
import { useState } from "react"
import { Bell, Briefcase, Filter, MoreHorizontal, PlusCircle, Search } from 'lucide-react'
import { useEmpresas } from "@/hooks/useEmpresas"
import { useOfertas } from "@/hooks/useOfertas"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AgregarOfertaModal } from "@/components/modals/ofertaModal"

export default function EmpresaPortal() {
    const { data: empresa } = useEmpresas()
    const { data: plazas, isLoading: plazasLoading } = useOfertas()
    const [plazaModalOpen, setPlazaModalOpen] = useState(false)
    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/auth/login"
    }

    const empresaActual = empresa?.[0] // Simulamos que estamos viendo la primera empresa

    // Filtramos las plazas de la empresa actual
    const plazasEmpresa = plazas?.filter((plaza) => plaza.empresa.id === empresaActual?.id) || []

    return (
        <div className="min-h-screen bg-muted/40">
            <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">LinkJob</h1>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">Portal Empresarial</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Empresa" />
                                <AvatarFallback>{empresaActual?.nombre?.substring(0, 2).toUpperCase() || "EM"}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </header>

            <main className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Portal Empresarial</h1>
                        <p className="text-muted-foreground">
                            Bienvenido, {empresaActual?.nombre || "Empresa"}. Gestione sus plazas y vea los egresados postulados.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Buscar..." className="pl-8 w-full md:w-[250px]" />
                        </div>
                        <Button onClick={() => setPlazaModalOpen(true)}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Publicar Plaza
                        </Button>
                    </div>
                </div>

                {/* Mis Plazas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mis Plazas de Trabajo</CardTitle>
                        <CardDescription>Gestione las plazas de trabajo publicadas por su empresa.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-end mb-4">
                            <Button variant="outline" size="sm" className="mr-2">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtrar
                            </Button>
                            <Button size="sm" onClick={() => setPlazaModalOpen(true)}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Publicar Plaza
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Área</TableHead>
                                    <TableHead>Publicada</TableHead>
                                    <TableHead>Expira</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Postulaciones</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plazasLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            Cargando plazas...
                                        </TableCell>
                                    </TableRow>
                                ) : plazasEmpresa.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            No hay plazas disponibles
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    plazasEmpresa.map((plaza) => (
                                        <TableRow key={plaza.id}>
                                            <TableCell className="font-medium">{plaza.titulo}</TableCell>
                                            <TableCell>{plaza.area}</TableCell>
                                            <TableCell>{new Date(plaza.fechaPublicacion).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(plaza.fechaExpiracion).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        plaza.estado === "activa"
                                                            ? "default"
                                                            : plaza.estado === "pendiente"
                                                                ? "outline"
                                                                : "secondary"
                                                    }
                                                >
                                                    {plaza.estado === "activa"
                                                        ? "Activa"
                                                        : plaza.estado === "pendiente"
                                                            ? "Pendiente"
                                                            : "Cerrada"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{plaza.aplicaciones}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                                        <DropdownMenuItem>Ver postulantes</DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            {plaza.estado === "activa" ? "Cerrar plaza" : "Reactivar"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Mostrando {plazasEmpresa.length} de {plazasEmpresa.length} plazas
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                Anterior
                            </Button>
                            <Button variant="outline" size="sm">
                                Siguiente
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                {/* Egresados Postulados */}
                <Card>
                    <CardHeader>
                        <CardTitle>Egresados Postulados</CardTitle>
                        <CardDescription>Visualice los egresados que han postulado a sus plazas de trabajo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-end mb-4">
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtrar
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Egresado</TableHead>
                                    <TableHead>Plaza</TableHead>
                                    <TableHead>Fecha de Postulación</TableHead>
                                    <TableHead>Habilidades</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                            Juan Díaz
                                        </div>
                                    </TableCell>
                                    <TableCell>Desarrollador Frontend</TableCell>
                                    <TableCell>12/03/2025</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            <Badge variant="outline" className="text-xs">
                                                React
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                TypeScript
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                +3 más
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">
                                            Ver perfil
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>MR</AvatarFallback>
                                            </Avatar>
                                            María Rodríguez
                                        </div>
                                    </TableCell>
                                    <TableCell>Analista de Datos</TableCell>
                                    <TableCell>10/03/2025</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            <Badge variant="outline" className="text-xs">
                                                Python
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                SQL
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                +2 más
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">
                                            Ver perfil
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Mostrando 2 de 2 postulantes</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                Anterior
                            </Button>
                            <Button variant="outline" size="sm">
                                Siguiente
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </main>

            {/* Modal para agregar plaza */}
            <AgregarOfertaModal
                open={plazaModalOpen}
                onOpenChange={setPlazaModalOpen}
                onSuccess={() => console.log("Plaza agregada exitosamente")}
            />
        </div>
    )
}
