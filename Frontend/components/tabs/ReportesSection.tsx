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
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts'

const COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#10b981", "#6366f1"]

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Reporte 2: Tasa de Éxito */}
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

          {/* Reporte 8: Habilidades Más Comunes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Habilidades Más Comunes en Egresados Contratados</CardTitle>
            </CardHeader>
            <CardContent>
              {cargandoPerfil ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={perfilContratados?.habilidades_top.map(([name, value]) => ({ name, value }))}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      fill="#3b82f6"
                      label
                    >
                      {perfilContratados?.habilidades_top.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Reporte 10: Ranking de Egresados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ranking de Egresados</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ranking}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={(e) => `${e.nombres} ${e.apellidos}`} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ranking_promedio" stroke="#a855f7" name="Ranking Prom." />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reporte 6: Contrataciones por Área */}
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

          {/* Reporte 4: Empresas con Mayor Contratación */}
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
