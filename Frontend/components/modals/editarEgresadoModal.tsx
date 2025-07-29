"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useActualizarEgresado } from "@/hooks/useEgresados"
import { Egresado } from "@/api/egresadoApi"

interface EditarEgresadoModalProps {
  egresado: Egresado | null
  open: boolean
  onClose: () => void
}

export default function EditarEgresadoModal({ egresado, open, onClose }: EditarEgresadoModalProps) {
  const [form, setForm] = useState<any>({})
  const actualizar = useActualizarEgresado()

  useEffect(() => {
    if (egresado) {
      setForm({
        apellidos: egresado.apellidos,
        tipoDoc: egresado.tipoDoc,
        numDoc: egresado.numDoc,
        email: egresado.email,
        telefono: egresado.telefono,
        direccion: egresado.direccion,
        nacionalidad: egresado.nacionalidad,
        fechaNacimiento: egresado.fechaNacimiento,
        linkedin: egresado.linkedin,
        github: egresado.github,
        cv: egresado.cv,
        disponibilidad: egresado.disponibilidad,
      })
    }
  }, [egresado])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = () => {
    if (!egresado) return
    actualizar.mutate(
      { id: egresado.id, data: form },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Egresado</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Apellidos</Label>
            <Input name="apellidos" value={form.apellidos || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" value={form.email || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input name="telefono" value={form.telefono || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input name="direccion" value={form.direccion || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Disponibilidad</Label>
            <input
              type="checkbox"
              name="disponibilidad"
              checked={form.disponibilidad || false}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
