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
import { toast } from "sonner";
import { Empresa } from "@/types/Empresa";

export default function EmpresaModal({ empresa, onSave }: { empresa?: Empresa; onSave: (data: Empresa) => void }) {
    const [formData, setFormData] = useState<Empresa>(
        empresa || { nombre: "", ruc: "", telefono: "", email: "", logo: "" }
    );
    const [open, setOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
        toast.success("Empresa guardada", { description: "La empresa se ha registrado correctamente." });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" onClick={() => setOpen(true)}>
                    {empresa ? "Editar Empresa" : "Registrar Empresa"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{empresa ? "Editar Empresa" : "Registrar Nueva Empresa"}</DialogTitle>
                    <DialogDescription>Ingresa los datos de la empresa</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Nombre</Label>
                        <Input name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>RUC</Label>
                        <Input name="ruc" value={formData.ruc} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Teléfono</Label>
                        <Input name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Logo (URL)</Label>
                        <Input type="url" name="logo" value={formData.logo} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>{empresa ? "Actualizar" : "Guardar"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
