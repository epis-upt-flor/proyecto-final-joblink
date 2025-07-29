"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

const TIPOS_OFERTA = [
    "TIEMPO COMPLETO",
    "MEDIO TIEMPO",
    "PRACTICAS",
    "FREELANCE",
    "TEMPORAL",
    "PROYECTO"
]

const MODALIDADES = [
    "PRESENCIAL",
    "REMOTO",
    "HIBRIDO"
]

const ESTADOS = [
    "ACTIVA",
    "PENDIENTE",
    "CERRADA"
]

const ESTADOS_PUBLICACION = [
    "PUBLICADA",
    "NO PUBLICADA"
]

export default function EditarOfertaModal({ oferta, open, onClose }: EditarOfertaModalProps) {
    const [formData, setFormData] = useState<OfertaUpdate>({})
    const { mutate: actualizarOferta, isPending } = useActualizarOferta()

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

    const handleSelectChange = (name: keyof OfertaUpdate) => (value: string) => {
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
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Editar Oferta Laboral</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Columna Izquierda */}
                    <div className="space-y-4">
                        <div>
                            <Label>Tipo de oferta</Label>
                            <Select 
                                value={formData.tipo || ""} 
                                onValueChange={handleSelectChange("tipo")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIPOS_OFERTA.map((tipo) => (
                                        <SelectItem key={tipo} value={tipo}>
                                            {tipo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Modalidad</Label>
                            <Select 
                                value={formData.modalidad || ""} 
                                onValueChange={handleSelectChange("modalidad")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione modalidad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MODALIDADES.map((modalidad) => (
                                        <SelectItem key={modalidad} value={modalidad}>
                                            {modalidad}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Horario</Label>
                            <Input 
                                name="horario" 
                                value={formData.horario || ""} 
                                onChange={handleChange} 
                                placeholder="Ej: Lunes a Viernes 9am-6pm"
                            />
                        </div>

                        <div>
                            <Label>Locación</Label>
                            <Input 
                                name="locacion" 
                                value={formData.locacion || ""} 
                                onChange={handleChange} 
                                placeholder="Ubicación física del trabajo"
                            />
                        </div>

                        <div>
                            <Label>Vacantes</Label>
                            <Input 
                                name="vacantes" 
                                type="number" 
                                value={formData.vacantes ?? ""} 
                                onChange={handleChange} 
                                min="1"
                            />
                        </div>

                        <div>
                            <Label>Salario (S/)</Label>
                            <Input 
                                name="salario" 
                                type="number" 
                                value={formData.salario ?? ""} 
                                onChange={handleChange} 
                                min="0"
                                step="100"
                            />
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-4">
                        <div>
                            <Label>Estado</Label>
                            <Select 
                                value={formData.estado || ""} 
                                onValueChange={handleSelectChange("estado")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ESTADOS.map((estado) => (
                                        <SelectItem key={estado} value={estado}>
                                            {estado}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Motivo</Label>
                            <Input 
                                name="motivo" 
                                value={formData.motivo || ""} 
                                onChange={handleChange} 
                                placeholder="Razón del estado"
                            />
                        </div>

                        <div>
                            <Label>Beneficios (uno por línea)</Label>
                            <Textarea
                                value={formData.beneficios?.join("\n") || ""}
                                onChange={handleBeneficiosChange}
                                rows={4}
                                placeholder="Seguro médico\nBonos por desempeño\nCapacitaciones"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Fecha de Inicio</Label>
                                <Input 
                                    name="fechaInicio" 
                                    type="date" 
                                    value={formData.fechaInicio || ""} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div>
                                <Label>Tiempo (meses)</Label>
                                <Input 
                                    name="tiempo" 
                                    type="number" 
                                    value={formData.tiempo ?? ""} 
                                    onChange={handleChange} 
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Fecha de Publicación</Label>
                                <Input 
                                    name="fechaPubli" 
                                    type="date" 
                                    value={formData.fechaPubli || ""} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div>
                                <Label>Estado de Publicación</Label>
                                <Select 
                                    value={formData.estadoPubli || ""} 
                                    onValueChange={handleSelectChange("estadoPubli")}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ESTADOS_PUBLICACION.map((estado) => (
                                            <SelectItem key={estado} value={estado}>
                                                {estado}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}