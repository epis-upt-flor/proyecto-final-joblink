import { useState, useEffect } from "react"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Egresado } from "@/types/Egresado"
import { useEgresados } from "@/context/EgresadoContext"
import DatosPersonales from "./tabs/DatosPersonales"
import Formacion from "./tabs/Formacion"
import RedesCV from "./tabs/RedesCV"

export default function EgresadoModal({ egresado, onSave, open, onOpenChange }: {
    egresado?: Egresado
    onSave: (data: Egresado) => void
    open?: boolean
    onOpenChange?: (val: boolean) => void
}) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = open !== undefined && onOpenChange !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setOpen = isControlled ? onOpenChange! : setInternalOpen
    const { crearEgresado, actualizarEgresado } = useEgresados()

    const [formData, setFormData] = useState<Egresado>(egresado || {
        nombres: "", apellidos: "", tipoDoc: "DNI", numDoc: "", email: "",
        telefono: "", direccion: "", nacionalidad: "", fechaNacimiento: "",
        habilidades: "", logrosAcademicos: "", certificados: "", experienciaLaboral: "",
        idiomas: "", linkedin: "", github: "", disponibilidad: true
    })

    useEffect(() => {
        if (egresado) setFormData(egresado)
    }, [egresado])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        setFormData({ ...formData, [name]: val })
    }

    const handleSave = async () => {
        try {
            const result = egresado
                ? await actualizarEgresado(formData)
                : await crearEgresado(formData)

            if (!result) throw new Error("No se pudo guardar el egresado")

            toast.success(`Egresado ${egresado ? "actualizado" : "registrado"} correctamente`)
            onSave(result)
            setOpen(false)
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {!egresado && (
                <DialogTrigger asChild>
                    <Button variant="default" onClick={() => setOpen(true)}>Registrar Egresado</Button>
                </DialogTrigger>
            )}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{egresado ? "Editar Egresado" : "Registrar Egresado"}</DialogTitle>
                    <DialogDescription>Completa la información del egresado</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="personales" className="space-y-4">
                    <TabsList className="grid grid-cols-3 w-full mb-4">
                        <TabsTrigger value="personales">Personales</TabsTrigger>
                        <TabsTrigger value="formacion">Formación</TabsTrigger>
                        <TabsTrigger value="extra">Redes / CV</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personales">
                        <DatosPersonales formData={formData} onChange={handleChange} />
                    </TabsContent>

                    <TabsContent value="formacion">
                        <Formacion formData={formData} setFormData={setFormData} />
                    </TabsContent>

                    <TabsContent value="extra">
                        <RedesCV formData={formData} onChange={handleChange} />
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>{egresado ? "Actualizar" : "Guardar"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
