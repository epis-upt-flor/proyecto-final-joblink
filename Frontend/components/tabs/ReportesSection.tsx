"use client"

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card"
import {
  useTasaExito,
  useEmpresasConMasContratos,
  useContratacionesPorArea,
  usePerfilEgresadosContratados,
  useRankingEgresados
} from "@/hooks/useReportes"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'

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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tasaExito} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey={(e) => `${e.nombres} ${e.apellidos}`} type="category" />
                    <Tooltip />
                    <Bar dataKey="tasa_exito" fill="#22c55e" name="Tasa de Éxito (%)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reporte 8: Habilidades Más Comunes */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Habilidades Más Comunes en Egresados Contratados</CardTitle>
            </CardHeader>
            <CardContent>
              {cargandoPerfil ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={perfilContratados?.habilidades_top.map(([name, value]) => ({ name, value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" name="Frecuencia" />
                  </BarChart>
                </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ranking} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey={(e) => `${e.nombres} ${e.apellidos}`} type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ranking_promedio" fill="#a855f7" name="Ranking" />
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contratacionesArea}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_contratos" fill="#f59e0b" name="Contratos" />
                </BarChart>
              </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={empresas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_contratos" fill="#10b981" name="Contratos" />
                    <Bar dataKey="promedio_dias" fill="#6366f1" name="Prom. Días" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

      </CardContent>
    </Card>
  )
}
