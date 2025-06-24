"use client"

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table"
import { FileText, TrendingUp } from "lucide-react"

import { useTasaExito, useEmpresasConMasContratos } from "@/hooks/useReportes"

export function ReportesSection() {
  const { data: tasaExito, isLoading: loadingExito } = useTasaExito()
  const { data: empresas, isLoading: loadingEmpresas } = useEmpresasConMasContratos()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes y Análisis</CardTitle>
        <CardDescription>
          Estadísticas y tendencias del sistema de recomendación.
        </CardDescription>
      </CardHeader>
      <CardContent>

        {/* Reporte 2: Tasa de Éxito */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tasa de Éxito de Egresados</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingExito ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Postulaciones</TableHead>
                      <TableHead>Contratos</TableHead>
                      <TableHead>Tasa de Éxito (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasaExito?.map((item) => (
                      <TableRow key={item.egresado_id}>
                        <TableCell>{item.nombres} {item.apellidos}</TableCell>
                        <TableCell>{item.postulaciones}</TableCell>
                        <TableCell>{item.contratos}</TableCell>
                        <TableCell>{item.tasa_exito}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reporte 4: Empresas con Mayor Contratación */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Empresas con Mayor Contratación</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingEmpresas ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Total Contratos</TableHead>
                      <TableHead>Promedio de Duración</TableHead>
                      <TableHead>¿Reincide?</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empresas?.map((e) => (
                      <TableRow key={e.empresa_id}>
                        <TableCell>{e.nombre}</TableCell>
                        <TableCell>{e.total_contratos}</TableCell>
                        <TableCell>{e.promedio_dias} días</TableCell>
                        <TableCell>{e.reincidencia ? "Sí" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Métricas Falsas (placeholder) */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resumen de Métricas (Mock)</CardTitle>
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
