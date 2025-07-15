"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Moon, Sun, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useContrataciones } from "@/hooks/useHistorial"
import { useEgresados } from "@/hooks/useEgresados"
import { useOfertas } from "@/hooks/useOfertas"
import { useEmpresas } from "@/hooks/useEmpresas"
import { useAprobarOferta, useRechazarOferta } from "@/hooks/useOfertas"
import { useTheme } from 'next-themes'
import { toast } from "sonner"

import { PlazasSection } from "@/components/tabs/PlazasSection"
import { EgresadosSection } from "@/components/tabs/EgresadosSection"
import { EmpresasSection } from "@/components/tabs/EmpresasSection"
import { AprobacionesSection } from "@/components/tabs/AprobacionesSection"
import { HistorialSection } from "@/components/tabs/HistorialSection"
import { ReportesSection } from "@/components/tabs/ReportesSection"
import { AgregarOfertaModal } from "@/components/modals/ofertaModal"
import { AgregarEgresadoModal } from "@/components/modals/egresadoModal"
import { AgregarEmpresaModal } from "@/components/modals/empresaModal"
import LogoWithTheme from "@/components/logo-theme"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminDashboard() {
  const { data: egresados, isLoading: egresadosLoading } = useEgresados()
  const { data: plazas, isLoading: plazasLoading, error } = useOfertas()
  const { data: contratacionesRaw, isLoading: historialLoading } = useContrataciones()
  const { data: empresas, isLoading: empresasLoading } = useEmpresas()

  const [egresadoModalOpen, setEgresadoModalOpen] = useState(false)
  const [empresaModalOpen, setEmpresaModalOpen] = useState(false)
  const [plazaModalOpen, setPlazaModalOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/auth/login"
  }

  const aprobarMutation = useAprobarOferta()
  const rechazarMutation = useRechazarOferta()

  const aprobar = (id: number) => {
    aprobarMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Oferta aprobada exitosamente")
      },
      onError: (error) => {
        toast.error("Error al aprobar", {
          description: String(error),
        })
      },
    })
  }

  const rechazar = ({ id, motivo }: { id: number; motivo: string }) => {
    rechazarMutation.mutate({ id, motivo }, {
      onSuccess: () => {
        toast.success("Oferta rechazada exitosamente")
      },
      onError: (error) => {
        toast.error("Error al rechazar la oferta", {
          description: String(error),
        })
      },
    })
  }

  const contrataciones = (contratacionesRaw || []).map((c: any) => ({
    iniciales: c.nombreEgresado?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "EG",
    nombre: c.nombreEgresado || "Egresado",
    empresa: c.nombreEmpresa || "Empresa",
    puesto: c.puesto || "Puesto no definido",
    fecha: new Date(c.fechaFin).toLocaleDateString("es-PE"),
    recomendado: c.recomendado ?? true,
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-muted/40"
    >
      <main className="flex-1">
        {/* Header Mejorado */}
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <LogoWithTheme />
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Contenido Principal */}
        <div className="p-4 md:p-6 space-y-6">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Panel de Administración</h1>
              <p className="text-muted-foreground mt-2">
                Gestión integral del sistema de recomendación laboral
              </p>
            </div>
          </motion.div>

          {/* Tabs con animación */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="plazas" className="w-full">
              <div className="overflow-x-auto pb-2">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                  <TabsTrigger value="plazas">Plazas</TabsTrigger>
                  <TabsTrigger value="egresados">Egresados</TabsTrigger>
                  <TabsTrigger value="empresas">Empresas</TabsTrigger>
                  <TabsTrigger value="aprobaciones">Aprobaciones</TabsTrigger>
                  <TabsTrigger value="historial">Historial</TabsTrigger>
                  <TabsTrigger value="reportes">Reportes</TabsTrigger>
                </TabsList>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <TabsContent value="plazas" className="mt-6">
                  <PlazasSection 
                    plazas={plazas} 
                    loading={plazasLoading} 
                    onAddPlaza={() => setPlazaModalOpen(true)} 
                  />
                </TabsContent>

                <TabsContent value="egresados" className="mt-6">
                  <EgresadosSection 
                    egresados={egresados} 
                    loading={egresadosLoading} 
                    onAddEgresado={() => setEgresadoModalOpen(true)} 
                  />
                </TabsContent>

                <TabsContent value="empresas" className="mt-6">
                  <EmpresasSection 
                    empresas={empresas} 
                    loading={empresasLoading} 
                    onAddEmpresa={() => setEmpresaModalOpen(true)} 
                  />
                </TabsContent>

                <TabsContent value="aprobaciones" className="mt-6">
                  <AprobacionesSection
                    ofertas={plazas}
                    onAprobar={aprobar}
                    onRechazar={rechazar}
                  />
                </TabsContent>

                <TabsContent value="historial" className="mt-6">
                  {historialLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <p className="text-muted-foreground">Cargando historial...</p>
                    </div>
                  ) : (
                    <HistorialSection contrataciones={contrataciones} />
                  )}
                </TabsContent>

                <TabsContent value="reportes" className="mt-6">
                  <ReportesSection />
                </TabsContent>
              </motion.div>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Modals */}
      <AgregarEgresadoModal
        open={egresadoModalOpen}
        onOpenChange={setEgresadoModalOpen}
        onSuccess={() => toast.success("Egresado agregado exitosamente")}
      />

      <AgregarEmpresaModal
        open={empresaModalOpen}
        onOpenChange={setEmpresaModalOpen}
        onSuccess={() => toast.success("Empresa agregada exitosamente")}
      />

      <AgregarOfertaModal
        open={plazaModalOpen}
        onOpenChange={setPlazaModalOpen}
        onSuccess={() => toast.success("Plaza agregada exitosamente")}
      />
    </motion.div>
  )
}