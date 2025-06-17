"use client"

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function AprobacionesSection({ ofertas = [], onAprobar, onRechazar }: any) {
    const [rechazoMotivo, setRechazoMotivo] = useState("")

    return (
        <Card>
            <CardHeader>
                <CardTitle>Aprobación de Plazas</CardTitle>
                <CardDescription>
                    Revisa y aprueba las plazas registradas por las empresas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Fecha de Publicación</TableHead>
                            <TableHead>Requisitos</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ofertas.filter((o: any) => o.estado === "PENDIENTE").length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No hay solicitudes pendientes
                                </TableCell>
                            </TableRow>
                        ) : (
                            ofertas
                                .filter((oferta: any) => oferta.estado === "PENDIENTE")
                                .map((oferta: any) => (
                                    <TableRow key={oferta.id}>
                                        <TableCell className="font-medium">{oferta.titulo}</TableCell>
                                        <TableCell>{oferta.empresa?.nombre || "Sin empresa"}</TableCell>
                                        <TableCell>
                                            {oferta.fechaPubli
                                                ? new Date(oferta.fechaPubli).toLocaleDateString()
                                                : "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">
                                                <FileText className="h-4 w-4 mr-2" /> Ver requisitos
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">Pendiente</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                    onClick={() => onAprobar(oferta.id)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Aprobar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                    onClick={() => {
                                                        const motivo = prompt("Ingrese el motivo de rechazo") || ""
                                                        if (motivo) onRechazar({ id: oferta.id, motivo })
                                                    }}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" /> Rechazar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Mostrando {ofertas.filter((o: any) => o.estado === "PENDIENTE").length} solicitudes
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
    )
}