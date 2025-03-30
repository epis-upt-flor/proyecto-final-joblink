import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Egresado } from "@/types/Egresado";

export default function EgresadoModal({
    egresado,
    onSave,
}: {
    egresado?: Egresado;
    onSave: (data: Egresado) => void;
}) {
    const [formData, setFormData] = useState<Egresado>(
        egresado || {
            nombre: "",
            apellido: "",
            dni: "",
            telefono: "",
            lugar_nacimiento: "",
            fecha_nacimiento: "",
            nacionalidad: "",
            correo: "",
            direccion: "",
            linkedin: "",
            github: "",
            habilidades: "",
            experiencia_laboral: "",
            certificados: "",
            idiomas: "",
            proyectos: "",
        }
    );

    const [open, setOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
        toast.success("Egresado guardado", { description: "El egresado ha sido registrado correctamente." });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" onClick={() => setOpen(true)}>
                    {egresado ? "Editar Egresado" : "Registrar Egresado"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{egresado ? "Editar Egresado" : "Registrar Nuevo Egresado"}</DialogTitle>
                    <DialogDescription>Ingresa los datos del egresado</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Nombre</Label>
                        <Input name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Apellido</Label>
                        <Input name="apellido" value={formData.apellido} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>DNI</Label>
                        <Input name="dni" value={formData.dni} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Teléfono</Label>
                        <Input name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Lugar de Nacimiento</Label>
                        <Input name="lugar_nacimiento" value={formData.lugar_nacimiento} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Fecha de Nacimiento</Label>
                        <Input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Nacionalidad</Label>
                        <Input name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Correo</Label>
                        <Input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Dirección</Label>
                        <Input name="direccion" value={formData.direccion} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>LinkedIn</Label>
                        <Input name="linkedin" value={formData.linkedin} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>GitHub</Label>
                        <Input name="github" value={formData.github} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Habilidades</Label>
                        <Textarea name="habilidades" value={formData.habilidades} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Experiencia Laboral</Label>
                        <Textarea name="experiencia_laboral" value={formData.experiencia_laboral} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Certificados</Label>
                        <Textarea name="certificados" value={formData.certificados} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Idiomas</Label>
                        <Textarea name="idiomas" value={formData.idiomas} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Proyectos</Label>
                        <Textarea name="proyectos" value={formData.proyectos} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>{egresado ? "Actualizar" : "Guardar"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
