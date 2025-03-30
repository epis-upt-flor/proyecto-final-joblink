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
import { Oferta } from "@/types/Oferta";
import { Empresa } from "@/types/Empresa";

export default function OfertaModal({
    oferta,
    onSave,
    empresas,
    onSaveEmpresa,
}: {
    oferta?: Oferta;
    onSave: (data: Oferta) => void;
    empresas: Empresa[];
    onSaveEmpresa: (empresa: Empresa) => void;
}) {
    const [formData, setFormData] = useState<Oferta>(
        oferta || {
            titulo: "",
            tipo: "",
            funciones: "",
            requisitos: "",
            beneficios: "",
            area: "",
            modalidad: "",
            carga_horaria: "",
            vacantes: 1,
            experiencia: "",
            ubigeo: "",
            salario: "",
            empresa_id: empresas.length > 0 ? empresas[0].id || 1 : 1,
            cerrada: false,
        }
    );

    const [open, setOpen] = useState(false);
    const [newEmpresa, setNewEmpresa] = useState<Empresa>({
        nombre: "",
        ruc: "",
        telefono: "",
        email: "",
        logo: "",
    });
    const [creatingEmpresa, setCreatingEmpresa] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmpresa({ ...newEmpresa, [e.target.name]: e.target.value });
    };

    const handleSaveEmpresa = () => {
        onSaveEmpresa(newEmpresa);
        toast.success("Empresa registrada", { description: "Se ha creado una nueva empresa." });
        setCreatingEmpresa(false);
    };

    const handleSave = () => {
        onSave(formData);
        toast.success("Oferta guardada", { description: "La oferta ha sido registrada correctamente." });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" onClick={() => setOpen(true)}>
                    {oferta ? "Editar Oferta" : "Registrar Oferta"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{oferta ? "Editar Oferta de Trabajo" : "Registrar Nueva Oferta"}</DialogTitle>
                    <DialogDescription>Ingresa los detalles de la oferta laboral</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">

                    <div>
                        <Label>Empresa</Label>
                        {!creatingEmpresa ? (
                            <>
                                <select
                                    name="empresa_id"
                                    value={formData.empresa_id}
                                    onChange={(e) => setFormData({ ...formData, empresa_id: Number(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                >
                                    {empresas.map((empresa) => (
                                        <option key={empresa.id} value={empresa.id}>
                                            {empresa.nombre}
                                        </option>
                                    ))}
                                </select>
                                <Button variant="outline" onClick={() => setCreatingEmpresa(true)} className="mt-2">
                                    Crear Nueva Empresa
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <Input name="nombre" placeholder="Nombre" value={newEmpresa.nombre} onChange={handleEmpresaChange} required />
                                <Input name="ruc" placeholder="RUC" value={newEmpresa.ruc} onChange={handleEmpresaChange} required />
                                <Input name="telefono" placeholder="Teléfono" value={newEmpresa.telefono} onChange={handleEmpresaChange} required />
                                <Input type="email" name="email" placeholder="Email" value={newEmpresa.email} onChange={handleEmpresaChange} required />
                                <Input name="logo" placeholder="URL del Logo" value={newEmpresa.logo} onChange={handleEmpresaChange} />
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setCreatingEmpresa(false)}>Cancelar</Button>
                                    <Button onClick={handleSaveEmpresa}>Guardar Empresa</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <Label>Título</Label>
                        <Input name="titulo" value={formData.titulo} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Tipo</Label>
                        <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Seleccione...</option>
                            <option value="Práctica Profesional">Práctica Profesional</option>
                            <option value="Práctica Pre Profesional">Práctica Pre Profesional</option>
                            <option value="Empleo">Empleo</option>
                        </select>
                    </div>

                    <div>
                        <Label>Área</Label>
                        <Input name="area" value={formData.area} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Modalidad</Label>
                        <Input name="modalidad" value={formData.modalidad} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Carga Horaria</Label>
                        <Input name="carga_horaria" value={formData.carga_horaria} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Vacantes</Label>
                        <Input type="number" name="vacantes" value={formData.vacantes} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Experiencia</Label>
                        <Input name="experiencia" value={formData.experiencia} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Ubicación</Label>
                        <Input name="ubigeo" value={formData.ubigeo} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Salario</Label>
                        <Input name="salario" value={formData.salario} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Funciones</Label>
                        <Textarea name="funciones" value={formData.funciones} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Requisitos</Label>
                        <Textarea name="requisitos" value={formData.requisitos} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Beneficios</Label>
                        <Textarea name="beneficios" value={formData.beneficios} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>{oferta ? "Actualizar" : "Guardar"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
