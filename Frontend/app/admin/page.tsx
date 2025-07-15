"use client"

import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/custom-tabs"
import { Filter, Moon, Sun, ArrowLeft, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useContrataciones } from "@/hooks/useHistorial"
import { useEgresados } from "@/hooks/useEgresados"
import { useOfertas } from "@/hooks/useOfertas"
import { useEmpresas } from "@/hooks/useEmpresas"
import { useAprobarOferta, useRechazarOferta } from "@/hooks/useOfertas"
import { useTheme } from 'next-themes'
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

import { PlazasSection } from "@/components/tabs/PlazasSection"
import { EgresadosSection } from "@/components/tabs/EgresadosSection"
import { EmpresasSection } from "@/components/tabs/EmpresasSection"
import { AprobacionesSection } from "@/components/tabs/AprobacionesSection"
import { HistorialSection } from "@/components/tabs/HistorialSection"
import { ReportesSection } from "@/components/tabs/ReportesSection"
import { AgregarOfertaModal } from "@/components/modals/ofertaModal"
import { AgregarEgresadoModal } from "@/components/modals/egresadoModal"
import { AgregarEmpresaModal } from "@/components/modals/empresaModal"
import { ThemeToggle } from "@/components/theme-toggle"
import LogoWithThemeAdmin from "@/components/logo-theme-admin"
import withAuth from "@/components/hoc/withAuth"

function AdminDashboard() {
  const {
    data: egresados,
    isLoading: egresadosLoading,
    refetch: refetchEgresados,
  } = useEgresados()

  const {
    data: plazas,
    isLoading: plazasLoading,
    error,
    refetch: refetchPlazas,
  } = useOfertas()

  const {
    data: empresas,
    isLoading: empresasLoading,
    refetch: refetchEmpresas,
  } = useEmpresas()

  const { data: contratacionesRaw, isLoading: historialLoading } = useContrataciones()

  const [egresadoModalOpen, setEgresadoModalOpen] = useState(false)
  const [empresaModalOpen, setEmpresaModalOpen] = useState(false)
  const [plazaModalOpen, setPlazaModalOpen] = useState(false)

  const [activeTab, setActiveTab] = useState("plazas")

  const aprobarMutation = useAprobarOferta()
  const rechazarMutation = useRechazarOferta()

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/auth/login"
  }

  const aprobar = (id: number) => {
    aprobarMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Oferta aprobada exitosamente")
        if (activeTab === "plazas") {
          refetchPlazas()
        }
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
        if (activeTab === "plazas") {
          refetchPlazas()
        }
      },
      onError: (error) => {
        toast.error("Error al rechazar la oferta", {
          description: String(error),
        })
      },
    })
  }

  const contrataciones = (contratacionesRaw || []).map((c: any) => ({
    iniciales:
      c.nombreEgresado?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "EG",
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
            <LogoWithThemeAdmin />
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border-2 border-primary/20 hover:border-primary/40 transition-all">
                    <AvatarImage 
                      src="/admin-avatar.png" 
                      alt="Admin"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white">
                      <span className="animate-pulse">AD</span>
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Administrador</p>
                    <p className="text-xs leading-none text-muted-foreground">Perfil Administrativo</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="overflow-x-auto pb-2 relative">
                <TabsList
                  activeTab={activeTab}
                  className="grid w-full grid-cols-3 md:grid-cols-6"
                >
                  <TabsTrigger value="plazas">Plazas</TabsTrigger>
                  <TabsTrigger value="egresados">Egresados</TabsTrigger>
                  <TabsTrigger value="empresas">Empresas</TabsTrigger>
                  <TabsTrigger value="aprobaciones">Aprobaciones</TabsTrigger>
                  <TabsTrigger value="historial">Historial</TabsTrigger>
                  <TabsTrigger value="reportes">Reportes</TabsTrigger>
                </TabsList>
              </div>

              <div className="relative mt-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {activeTab === "plazas" && (
                    <motion.div
                      key="plazas"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      {plazasLoading ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-[200px]" />
                            <Skeleton className="h-10 w-[150px]" />
                          </div>
                          <Skeleton className="h-[400px] w-full rounded-lg" />
                        </div>
                      ) : (
                        <PlazasSection
                          plazas={plazas}
                          loading={plazasLoading}
                          onAddPlaza={() => setPlazaModalOpen(true)}
                          onRefresh={refetchPlazas}
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "egresados" && (
                    <motion.div
                      key="egresados"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      {egresadosLoading ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-[200px]" />
                            <Skeleton className="h-10 w-[150px]" />
                          </div>
                          <Skeleton className="h-[400px] w-full rounded-lg" />
                        </div>
                      ) : (
                        <EgresadosSection
                          egresados={egresados}
                          loading={egresadosLoading}
                          onAddEgresado={() => setEgresadoModalOpen(true)}
                          onRefresh={refetchEgresados}
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "empresas" && (
                    <motion.div
                      key="empresas"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      {empresasLoading ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-[200px]" />
                            <Skeleton className="h-10 w-[150px]" />
                          </div>
                          <Skeleton className="h-[400px] w-full rounded-lg" />
                        </div>
                      ) : (
                        <EmpresasSection
                          empresas={empresas}
                          loading={empresasLoading}
                          onAddEmpresa={() => setEmpresaModalOpen(true)}
                          onRefresh={refetchEmpresas}
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "aprobaciones" && (
                    <motion.div
                      key="aprobaciones"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      {plazasLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-[200px]" />
                          <Skeleton className="h-[400px] w-full rounded-lg" />
                        </div>
                      ) : (
                        <AprobacionesSection
                          ofertas={plazas}
                          onAprobar={aprobar}
                          onRechazar={rechazar}
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "historial" && (
                    <motion.div
                      key="historial"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      {historialLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-[200px]" />
                          <Skeleton className="h-[400px] w-full rounded-lg" />
                        </div>
                      ) : (
                        <HistorialSection contrataciones={contrataciones} />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "reportes" && (
                    <motion.div
                      key="reportes"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <ReportesSection />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Modals */}
      <AgregarEgresadoModal
        open={egresadoModalOpen}
        onOpenChange={setEgresadoModalOpen}
        onSuccess={() => {
          toast.success("Egresado agregado exitosamente")
          if (activeTab === "egresados") {
            refetchEgresados()
          }
        }}
      />

      <AgregarEmpresaModal
        open={empresaModalOpen}
        onOpenChange={setEmpresaModalOpen}
        onSuccess={() => {
          toast.success("Empresa agregada exitosamente");
          if (activeTab === "empresas") {
            refetchEmpresas()
          }
        }}
      />

      <AgregarOfertaModal
        open={plazaModalOpen}
        onOpenChange={setPlazaModalOpen}
        onSuccess={() => {
          toast.success("Plaza agregada exitosamente")
          if (activeTab === "plazas") {
            refetchPlazas()
          }
        }}
      />
    </motion.div>
  )
}

export default withAuth(AdminDashboard, ["1"])