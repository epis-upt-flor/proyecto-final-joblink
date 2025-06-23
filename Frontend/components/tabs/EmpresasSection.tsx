"use client"

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { EditarEmpresaModal } from "@/components/modals/editarEmpresaModal"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 3

export function EmpresasSection({ empresas = [], loading, onAddEmpresa }: any) {
  const [page, setPage] = useState(0)
  const router = useRouter()
  const totalPages = Math.ceil(empresas.length / ITEMS_PER_PAGE)
  const start = page * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const paginatedEmpresas = empresas.slice(start, end)
  const handleVerDetalle = (id: number) => {
    router.push(`/empresa/${id}`)
  }
  const handlePrevious = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1)
  }
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<any | null>(null)
  const [modalEditarOpen, setModalEditarOpen] = useState(false)

  const handleEditarEmpresa = (empresa: any) => {
    setEmpresaSeleccionada(empresa)
    setModalEditarOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Empresas</CardTitle>
          <CardDescription>Administra las empresas asociadas que contratan egresados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={onAddEmpresa}>
              <PlusCircle className="h-4 w-4 mr-2" /> Agregar Empresa
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>RUC</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Cargando empresas...</TableCell>
                </TableRow>
              ) : empresas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No hay empresas registradas</TableCell>
                </TableRow>
              ) : (
                paginatedEmpresas.map((empresa: any) => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {empresa.logo ? (
                            <AvatarImage src={empresa.logo} alt={empresa.nombre} />
                          ) : null}
                          <AvatarFallback>
                            {empresa.nombre.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {empresa.nombre}
                      </div>
                    </TableCell>
                    <TableCell>{empresa.ruc}</TableCell>
                    <TableCell>{empresa.telefono}</TableCell>
                    <TableCell>{empresa.estado ? "Activa" : "Inactiva"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleVerDetalle(empresa.id)}>
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditarEmpresa(empresa)}>
                            Editar información
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {start + 1}–{Math.min(end, empresas.length)} de {empresas.length} empresas
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevious} disabled={page === 0}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={page >= totalPages - 1}>
              Siguiente
            </Button>
          </div>
        </CardFooter>
      </Card>

      {empresaSeleccionada && (
        <EditarEmpresaModal
          open={modalEditarOpen}
          onOpenChange={setModalEditarOpen}
          empresa={empresaSeleccionada}
          onSuccess={() => {
            toast.success("Empresa actualizada correctamente")
            window.location.reload()
          }}
        />
      )}
    </>
  )
}