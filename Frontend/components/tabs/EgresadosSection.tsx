"use client"

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { useRouter } from "next/navigation"
import EditarEgresadoModal from "../modals/editarEgresadoModal"

const ITEMS_PER_PAGE = 3

export function EgresadosSection({ egresados = [], loading, onAddEgresado }: any) {
    const [page, setPage] = useState(0)
    const router = useRouter()
    const totalPages = Math.ceil(egresados.length / ITEMS_PER_PAGE)
    const start = page * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    const paginatedEgresados = egresados.slice(start, end)
    const handleVerDetalle = (id: number) => {
        router.push(`/egresado/${id}`)
    }

    const handlePrevious = () => {
        if (page > 0) setPage(page - 1)
    }

    const handleNext = () => {
        if (page < totalPages - 1) setPage(page + 1)
    }
    const [egresadoSeleccionado, setEgresadoSeleccionado] = useState<any>(null)
    const [modalAbierto, setModalAbierto] = useState(false)
    const handleEditar = (egresado: any) => {
        setEgresadoSeleccionado(egresado)
        setModalAbierto(true)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Egresados</CardTitle>
                    <CardDescription>Administra los perfiles de egresados y sus habilidades profesionales.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" className="mr-2">
                            <FileUp className="h-4 w-4 mr-2" /> Carga Masiva
                        </Button>
                        <Button size="sm" onClick={onAddEgresado}>
                            <PlusCircle className="h-4 w-4 mr-2" /> Agregar Egresado
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Habilidades</TableHead>
                                <TableHead>Disponibilidad</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Cargando egresados...</TableCell>
                                </TableRow>
                            ) : paginatedEgresados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">No hay egresados registrados</TableCell>
                                </TableRow>
                            ) : (
                                paginatedEgresados.map((egresado: any) => (
                                    <TableRow key={egresado.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{`${egresado.nombres?.charAt(0) || ""}${egresado.apellidos?.charAt(0) || ""}`}</AvatarFallback>
                                                </Avatar>
                                                {`${egresado.nombres} ${egresado.apellidos}`}
                                            </div>
                                        </TableCell>
                                        <TableCell>{`${egresado.tipoDoc}: ${egresado.numDoc}`}</TableCell>
                                        <TableCell>{egresado.email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {egresado.habilidades?.slice(0, 3).map((habilidad: string, index: number) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {habilidad}
                                                    </Badge>
                                                ))}
                                                {(egresado.habilidades?.length || 0) > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{(egresado.habilidades.length || 0) - 3} más
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={egresado.disponibilidad ? "outline" : "default"}>
                                                {egresado.disponibilidad ? "Disponible" : "No disponible"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">

                                                    <DropdownMenuItem onClick={() => handleVerDetalle(egresado.id)}>
                                                        Ver perfil completo
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditar(egresado)}>
                                                        Editar información
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
                        Mostrando {egresados.length === 0 ? 0 : start + 1}–{Math.min(end, egresados.length)} de {egresados.length} egresados
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
            <EditarEgresadoModal
                egresado={egresadoSeleccionado}
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
            />
        </>
    )
}
