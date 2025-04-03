import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OfertaModal({
    oferta,
    onSave,
    empresas,
    onSaveEmpresa,
    open,
    onOpenChange,
}: {
    oferta?: Oferta;
    onSave: (data: Oferta) => void;
    empresas: Empresa[];
    onSaveEmpresa: (empresa: Empresa) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {

    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined && onOpenChange !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const setOpen = isControlled ? onOpenChange! : setInternalOpen;

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
    useEffect(() => {
        if (oferta) {
            setFormData(oferta);
        }
    }, [oferta]);
    const [newEmpresa, setNewEmpresa] = useState<Empresa>({
        nombre: "",
        ruc: "",
        telefono: "",
        email: "",
        logo: "",
    });

    const [creatingEmpresa, setCreatingEmpresa] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmpresa({ ...newEmpresa, [e.target.name]: e.target.value });
    };

    const handleSaveEmpresa = () => {
        onSaveEmpresa(newEmpresa);
        toast.success("Empresa registrada", {
            description: "Se ha creado una nueva empresa.",
        });
        setCreatingEmpresa(false);
    };

    const handleSave = () => {
        onSave(formData);
        toast.success("Oferta guardada", {
            description: "La oferta ha sido registrada correctamente.",
        });
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {!oferta && (
                <DialogTrigger asChild>
                    <Button variant="default" onClick={() => setOpen(true)}>
                        Registrar Oferta
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {oferta ? "Editar Oferta de Trabajo" : "Registrar Nueva Oferta"}
                    </DialogTitle>
                    <DialogDescription>
                        Ingresa los detalles de la oferta laboral
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="generales" className="space-y-4">
                    <TabsList className="grid grid-cols-3 w-full mb-4">
                        <TabsTrigger value="generales">Generales</TabsTrigger>
                        <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
                        <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                    </TabsList>

                    <TabsContent value="generales" className="space-y-4">
                        {/* Empresa */}
                        <div>
                            <Label>Empresa</Label>
                            {!creatingEmpresa ? (
                                <>
                                    <select
                                        name="empresa_id"
                                        value={formData.empresa_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, empresa_id: Number(e.target.value) })
                                        }
                                        className="w-full p-2 border rounded"
                                    >
                                        {empresas.map((empresa) => (
                                            <option key={empresa.id} value={empresa.id}>
                                                {empresa.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCreatingEmpresa(true)}
                                        className="mt-2"
                                    >
                                        Crear Nueva Empresa
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Input name="nombre" placeholder="Nombre" value={newEmpresa.nombre} onChange={handleEmpresaChange} />
                                    <Input name="ruc" placeholder="RUC" value={newEmpresa.ruc} onChange={handleEmpresaChange} />
                                    <Input name="telefono" placeholder="Teléfono" value={newEmpresa.telefono} onChange={handleEmpresaChange} />
                                    <Input name="email" type="email" placeholder="Email" value={newEmpresa.email} onChange={handleEmpresaChange} />
                                    <Input name="logo" placeholder="URL del Logo" value={newEmpresa.logo} onChange={handleEmpresaChange} />
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setCreatingEmpresa(false)}>Cancelar</Button>
                                        <Button onClick={handleSaveEmpresa}>Guardar Empresa</Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <InputGroup label="Título" name="titulo" value={formData.titulo} onChange={handleChange} />
                        <SelectGroup
                            label="Tipo"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            options={[
                                "Práctica Profesional",
                                "Práctica Pre Profesional",
                                "Empleo",
                            ]}
                        />
                        <InputGroup label="Área" name="area" value={formData.area} onChange={handleChange} />
                        <InputGroup label="Modalidad" name="modalidad" value={formData.modalidad} onChange={handleChange} />
                        <InputGroup label="Carga Horaria" name="carga_horaria" value={formData.carga_horaria} onChange={handleChange} />
                    </TabsContent>

                    <TabsContent value="requisitos" className="space-y-4">
                        <InputGroup label="Vacantes" name="vacantes" type="number" value={formData.vacantes} onChange={handleChange} />
                        <InputGroup label="Experiencia" name="experiencia" value={formData.experiencia} onChange={handleChange} />
                        <InputGroup label="Ubicación" name="ubigeo" value={formData.ubigeo} onChange={handleChange} />
                        <InputGroup label="Salario" name="salario" value={formData.salario} onChange={handleChange} />
                    </TabsContent>

                    <TabsContent value="descripcion" className="space-y-4">
                        <TextareaGroup label="Funciones" name="funciones" value={formData.funciones} onChange={handleChange} />
                        <TextareaGroup label="Requisitos" name="requisitos" value={formData.requisitos} onChange={handleChange} />
                        <TextareaGroup label="Beneficios" name="beneficios" value={formData.beneficios} onChange={handleChange} />
                    </TabsContent>
                </Tabs>


                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                        {oferta ? "Actualizar" : "Guardar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function InputGroup({
    label,
    ...props
}: {
    label: string;
    name: string;
    value: any;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    type?: string;
}) {
    return (
        <div>
            <Label>{label}</Label>
            <Input {...props} required />
        </div>
    );
}

function TextareaGroup({
    label,
    ...props
}: {
    label: string;
    name: string;
    value: any;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}) {
    return (
        <div>
            <Label>{label}</Label>
            <Textarea {...props} required />
        </div>
    );
}

function SelectGroup({
    label,
    name,
    value,
    onChange,
    options,
}: {
    label: string;
    name: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    options: string[];
}) {
    return (
        <div>
            <Label>{label}</Label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-2 border rounded"
                required
            >
                <option value="">Seleccione...</option>
                {options.map((opt, i) => (
                    <option key={i} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}
