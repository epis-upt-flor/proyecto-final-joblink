"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useContrataciones } from "@/hooks/useHistorial"
import { useEgresados } from "@/hooks/useEgresados"
import { useOfertas } from "@/hooks/useOfertas"
import { useEmpresas } from "@/hooks/useEmpresas"
import { useAprobarOferta, useRechazarOferta } from "@/hooks/useOfertas"

import { PlazasSection } from "@/components/tabs/PlazasSection"
import { EgresadosSection } from "@/components/tabs/EgresadosSection"
import { EmpresasSection } from "@/components/tabs/EmpresasSection"
import { AprobacionesSection } from "@/components/tabs/AprobacionesSection"
import { HistorialSection } from "@/components/tabs/HistorialSection"
import { ReportesSection } from "@/components/tabs/ReportesSection"
import { AgregarOfertaModal } from "@/components/modals/ofertaModal"
import { AgregarEgresadoModal } from "@/components/modals/egresadoModal"
import { AgregarEmpresaModal } from "@/components/modals/empresaModal"
import { toast } from "sonner"

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
        toast("Oferta aprobada exitosamente")
      },
      onError: (error) => {
        toast("Error al aprobar", {
          description: String(error),
        })
      },
    })
  }


  const rechazar = ({ id, motivo }: { id: number; motivo: string }) => {
    rechazarMutation.mutate({ id, motivo }, {
      onSuccess: () => {
        console.log("Oferta rechazada")
      },
      onError: (error) => {
        alert("Error al rechazar la oferta: " + error)
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

  const toggleTheme = () => {
    const current = localStorage.getItem("theme")
    const newTheme = current === "dark" ? "light" : "dark"
    localStorage.setItem("theme", newTheme)
    window.location.reload()
  }

  console.log(contratacionesRaw)

  return (
    <div className="min-h-screen bg-muted/40">
      <main className="flex-1">
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">LinkJob</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Moon className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">Gestiona el sistema de recomendación de egresados</p>
            </div>
          </div>

          <Tabs defaultValue="plazas" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-6 w-full max-w-3xl">
                <TabsTrigger value="plazas">Plazas</TabsTrigger>
                <TabsTrigger value="egresados">Egresados</TabsTrigger>
                <TabsTrigger value="empresas">Empresas</TabsTrigger>
                <TabsTrigger value="aprobaciones">Aprobaciones</TabsTrigger>
                <TabsTrigger value="historial">Historial</TabsTrigger>
                <TabsTrigger value="reportes">Reportes</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="plazas">
              <PlazasSection plazas={plazas} loading={plazasLoading} onAddPlaza={() => setPlazaModalOpen(true)} />
            </TabsContent>

            <TabsContent value="egresados">
              <EgresadosSection egresados={egresados} loading={egresadosLoading} onAddEgresado={() => setEgresadoModalOpen(true)} />
            </TabsContent>

            <TabsContent value="empresas">
              <EmpresasSection empresas={empresas} loading={empresasLoading} onAddEmpresa={() => setEmpresaModalOpen(true)} />
            </TabsContent>

            <TabsContent value="aprobaciones">
              <AprobacionesSection
                ofertas={plazas}
                onAprobar={aprobar}
                onRechazar={rechazar}
              />
            </TabsContent>



            <TabsContent value="historial">
              {historialLoading ? (
                <p className="text-muted-foreground">Cargando historial...</p>
              ) : (
                <HistorialSection contrataciones={contrataciones} />
              )}
            </TabsContent>


            <TabsContent value="reportes">
              <ReportesSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AgregarEgresadoModal
        open={egresadoModalOpen}
        onOpenChange={setEgresadoModalOpen}
        onSuccess={() => console.log("Egresado agregado exitosamente")}
      />

      <AgregarEmpresaModal
        open={empresaModalOpen}
        onOpenChange={setEmpresaModalOpen}
        onSuccess={() => console.log("Empresa agregada exitosamente")}
      />

      <AgregarOfertaModal
        open={plazaModalOpen}
        onOpenChange={setPlazaModalOpen}
        onSuccess={() => console.log("Plaza agregada exitosamente")}
      />
    </div>
  )
}
