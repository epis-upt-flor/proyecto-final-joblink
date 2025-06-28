"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Oferta, OfertaUpdate } from "@/api/ofertaApi"
import { useActualizarOferta } from "@/hooks/useOfertas"

interface EditarOfertaModalProps {
    oferta: Oferta | null
    open: boolean
    onClose: () => void
}

export default function EditarOfertaModal({ oferta, open, onClose }: EditarOfertaModalProps) {
    const [formData, setFormData] = useState<OfertaUpdate>({})
    const { mutate: actualizarOferta, isLoading } = useActualizarOferta()

    useEffect(() => {
        if (oferta) {
            const {
                tipo, fechaCierre, modalidad, horario, vacantes,
                locacion, salario, estado, motivo, beneficios,
                fechaInicio, tiempo, fechaPubli, estadoPubli
            } = oferta

            setFormData({
                tipo,
                fechaCierre,
                modalidad,
                horario,
                vacantes,
                locacion,
                salario,
                estado,
                motivo,
                beneficios,
                fechaInicio,
                tiempo,
                fechaPubli,
                estadoPubli,
            })
        }
    }, [oferta])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleBeneficiosChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value.split("\n").map(line => line.trim()).filter(Boolean)
        setFormData(prev => ({
            ...prev,
            beneficios: value,
        }))
    }

    const handleSubmit = () => {
        if (!oferta) return
        actualizarOferta({
            id: oferta.id,
            oferta: formData,
        }, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Editar Oferta Laboral</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Tipo</Label>
                            <Input name="tipo" value={formData.tipo || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Modalidad</Label>
                            <Input name="modalidad" value={formData.modalidad || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Horario</Label>
                            <Input name="horario" value={formData.horario || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Locación</Label>
                            <Input name="locacion" value={formData.locacion || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Vacantes</Label>
                            <Input name="vacantes" type="number" value={formData.vacantes ?? ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Salario</Label>
                            <Input name="salario" type="number" value={formData.salario ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Estado</Label>
                            <Input name="estado" value={formData.estado || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Motivo</Label>
                            <Input name="motivo" value={formData.motivo || ""} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <Label>Beneficios (uno por línea)</Label>
                        <Textarea
                            value={formData.beneficios?.join("\n") || ""}
                            onChange={handleBeneficiosChange}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Fecha Inicio</Label>
                            <Input name="fechaInicio" type="date" value={formData.fechaInicio || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Tiempo (meses)</Label>
                            <Input name="tiempo" type="number" value={formData.tiempo ?? ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Fecha Publicación</Label>
                            <Input name="fechaPubli" type="date" value={formData.fechaPubli || ""} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <Label>Estado de publicación</Label>
                        <Input name="estadoPubli" value={formData.estadoPubli || ""} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
