'use client'

import {
    Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card"
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileUp, PlusCircle, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 3

export function PlazasSection({ plazas = [], loading, onAddPlaza }: any) {
    const aprobadas = plazas.filter(
        (p: any) => p.estado === "ACTIVA" && p.estadoPubli === "PUBLICADA"
    )
    const router = useRouter()

    const [page, setPage] = useState(0)
    const totalPages = Math.ceil(aprobadas.length / ITEMS_PER_PAGE)
    const start = page * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    const paginatedPlazas = aprobadas.slice(start, end)

    const handlePrevious = () => page > 0 && setPage(page - 1)
    const handleNext = () => page < totalPages - 1 && setPage(page + 1)

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Plazas de Trabajo Disponibles</CardTitle>
                        <CardDescription>
                            Gestiona las plazas de trabajo ofrecidas por la escuela y empresas asociadas.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <FileUp className="h-4 w-4 mr-2" /> Importar
                        </Button>
                        <Button size="sm" onClick={onAddPlaza}>
                            <PlusCircle className="h-4 w-4 mr-2" /> Agregar Plaza
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Área</TableHead>
                            <TableHead>Publicada</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">Cargando plazas...</TableCell>
                            </TableRow>
                        ) : paginatedPlazas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">No hay plazas disponibles</TableCell>
                            </TableRow>
                        ) : (
                            paginatedPlazas.map((plaza: any) => (
                                <TableRow key={plaza.id}>
                                    <TableCell className="font-medium">{plaza.titulo}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                {plaza.empresa?.logo && (
                                                    <AvatarImage src={plaza.empresa.logo} alt={plaza.empresa.nombre} />
                                                )}
                                                <AvatarFallback>
                                                    {plaza.empresa?.nombre?.substring(0, 2).toUpperCase() || "EM"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{plaza.empresa?.nombre || "Sin empresa"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{plaza.area}</TableCell>
                                    <TableCell>
                                        {plaza.fechaPubli
                                            ? new Date(plaza.fechaPubli).toLocaleDateString()
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">Activa</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => router.push(`/oferta/${plaza.id}`)}>
                                                    Ver detalles
                                                </DropdownMenuItem>

                                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                                <DropdownMenuItem>Recomendar egresados</DropdownMenuItem>
                                                <DropdownMenuItem>Desactivar</DropdownMenuItem>
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
                    Mostrando {aprobadas.length === 0 ? 0 : start + 1}–{Math.min(end, aprobadas.length)} de {aprobadas.length} plazas
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrevious} disabled={page === 0}>
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNext} disabled={page >= totalPages - 1}>
                        Siguiente
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
