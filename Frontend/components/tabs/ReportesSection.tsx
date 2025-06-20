"use client"
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, BarChart3, PieChart, TrendingUp, UserCheck } from "lucide-react"
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table"

export function ReportesSection({ }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reportes y Análisis</CardTitle>
                <CardDescription>Estadísticas y tendencias del sistema de recomendación.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Tasa de Éxito por Empresa</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <BarChart3 className="h-40 w-40 mx-auto" />
                                <p className="text-sm">Gráfico de barras: Tasa de éxito por empresa</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Distribución de Contrataciones por Área</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <PieChart className="h-40 w-40 mx-auto" />
                                <p className="text-sm">Gráfico circular: Distribución por área</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Tendencias de Contratación</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <TrendingUp className="h-40 w-40 mx-auto" />
                                <p className="text-sm">Gráfico de líneas: Tendencias temporales</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Precisión del Sistema de Recomendación</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <UserCheck className="h-40 w-40 mx-auto" />
                                <p className="text-sm">Gráfico de precisión del sistema</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Resumen de Métricas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Métrica</TableHead>
                                        <TableHead>Valor Actual</TableHead>
                                        <TableHead>Cambio</TableHead>
                                        <TableHead>Tendencia</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Tasa de Recomendación Exitosa</TableCell>
                                        <TableCell>78%</TableCell>
                                        <TableCell className="text-green-500">+15%</TableCell>
                                        <TableCell>
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Tiempo Promedio de Colocación</TableCell>
                                        <TableCell>45 días</TableCell>
                                        <TableCell className="text-green-500">-12 días</TableCell>
                                        <TableCell>
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Empresas con Mayor Demanda</TableCell>
                                        <TableCell>TechSolutions</TableCell>
                                        <TableCell>+4 plazas</TableCell>
                                        <TableCell>
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Habilidades Más Solicitadas</TableCell>
                                        <TableCell>React, Python, AWS</TableCell>
                                        <TableCell>+25% demanda</TableCell>
                                        <TableCell>
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <Button className="ml-auto">
                                <FileText className="h-4 w-4 mr-2" /> Generar Reporte Completo
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}
