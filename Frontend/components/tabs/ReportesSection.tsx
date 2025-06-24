"use client"

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table"
import { FileText, TrendingUp } from "lucide-react"

import {
  useTasaExito,
  useEmpresasConMasContratos,
  useContratacionesPorArea,
  usePerfilEgresadosContratados,
  useRankingEgresados
} from "@/hooks/useReportes"

export function ReportesSection() {
  const { data: tasaExito, isLoading: loadingExito } = useTasaExito()
  const { data: empresas, isLoading: loadingEmpresas } = useEmpresasConMasContratos()
  const { data: contratacionesArea } = useContratacionesPorArea()
  const { data: perfilContratados, isLoading: cargandoPerfil } = usePerfilEgresadosContratados()
  const { data: ranking } = useRankingEgresados()

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

        {/* Reporte 8: Perfil de Egresados Contratados */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Habilidades Más Comunes en Egresados Contratados</CardTitle>
            </CardHeader>
            <CardContent>
              {cargandoPerfil ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Habilidad</TableHead>
                      <TableHead>Frecuencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perfilContratados?.habilidades_top?.map(([habilidad, frecuencia], index) => (
                      <TableRow key={index}>
                        <TableCell>{habilidad}</TableCell>
                        <TableCell>{frecuencia}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reporte 10: Ranking de Egresados */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ranking de Egresados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ranking Promedio</TableHead>
                    <TableHead>Contratos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking?.map((item) => (
                    <TableRow key={item.egresado_id}>
                      <TableCell>{item.nombres} {item.apellidos}</TableCell>
                      <TableCell>{item.ranking_promedio.toFixed(2)}</TableCell>
                      <TableCell>{item.total_contratos}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Reporte 6: Contrataciones por Área */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contrataciones por Área</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Área</TableHead>
                    <TableHead>Total Contratos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratacionesArea?.map((item) => (
                    <TableRow key={item.area}>
                      <TableCell>{item.area}</TableCell>
                      <TableCell>{item.total_contratos}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

      </CardContent>
    </Card>
  )
}