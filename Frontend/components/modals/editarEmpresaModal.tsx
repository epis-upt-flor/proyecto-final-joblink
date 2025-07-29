"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    empresa: {
        id: number
        nombre: string
        ruc: string
        telefono: string
        logo?: string
        estado: boolean
    }
    onSuccess?: () => void
}

export function EditarEmpresaModal({ open, onOpenChange, empresa, onSuccess }: Props) {
    const [form, setForm] = useState(empresa)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }
    const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8003"
    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/empresas/${empresa.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.detail || "Error al editar la empresa")
            }

            toast.success("Empresa actualizada correctamente")
            onOpenChange(false)
            onSuccess?.()
        } catch (err: any) {
            toast.error(err.message || "Error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Empresa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Nombre</Label>
                        <Input name="nombre" value={form.nombre} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>RUC</Label>
                        <Input name="ruc" value={form.ruc} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Teléfono</Label>
                        <Input name="telefono" value={form.telefono} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Logo (URL)</Label>
                        <Input name="logo" value={form.logo} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="estado"
                            checked={form.estado}
                            onChange={handleChange}
                            id="estado"
                        />
                        <Label htmlFor="estado">Activo</Label>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
