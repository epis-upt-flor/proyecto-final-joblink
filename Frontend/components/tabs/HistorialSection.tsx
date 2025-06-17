"use client"
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card"
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function HistorialSection({ contrataciones }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Historial de Contrataciones</CardTitle>
                <CardDescription>Registro histórico de egresados contratados por empresas.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end mb-4">
                    <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" /> Exportar Historial
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Egresado</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Puesto</TableHead>
                            <TableHead>Fecha de Contratación</TableHead>
                            <TableHead>Recomendado por Sistema</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contrataciones?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No hay registros</TableCell>
                            </TableRow>
                        ) : (
                            contrataciones.map((item: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{item.iniciales}</AvatarFallback>
                                            </Avatar>
                                            {item.nombre}
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.empresa}</TableCell>
                                    <TableCell>{item.puesto}</TableCell>
                                    <TableCell>{item.fecha}</TableCell>
                                    <TableCell>
                                        <Badge className={item.recomendado ? "bg-green-500" : "bg-muted"}>
                                            {item.recomendado ? "Sí" : "No"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">Ver detalles</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Mostrando {contrataciones?.length || 0} registros</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Anterior</Button>
                    <Button variant="outline" size="sm">Siguiente</Button>
                </div>
            </CardFooter>
        </Card>
    )
}
