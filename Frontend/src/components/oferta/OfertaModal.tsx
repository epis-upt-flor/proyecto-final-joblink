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
import { useOfertas } from "@/context/OfertasContext";

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
    const { crearOferta } = useOfertas();
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined && onOpenChange !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const setOpen = isControlled ? onOpenChange! : setInternalOpen;

    const [formData, setFormData] = useState<Oferta>(() => {
        const defaultEmpresa = empresas[0];

        return (
            oferta || {
                titulo: "",
                tipo: "",
                area: "",
                modalidad: "",
                horario: "",
                vacantes: 1,
                experiencia: "",
                locacion: "",
                salario: 0,
                funciones: "",
                requisitos: "",
                beneficios: "",
                fechaInicio: "",
                tiempo: 1,
                idEmpresa: defaultEmpresa?.id ?? 1,
                empresaNombre: defaultEmpresa?.nombre ?? "",
            }
        );
    });


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

    const handleSave = async () => {
        const { empresaNombre, ...payload } = formData;
        if (!formData.fechaInicio) {
            toast.error("Por favor, selecciona una fecha de inicio válida");
            return;
        }


        if (!oferta) {
            const success = await crearOferta(payload);
            if (success) {
                toast.success("Oferta registrada correctamente");
                setOpen(false);
            } else {
                toast.error("Error al registrar oferta");
            }
        } else {
            onSave(formData);
            toast.success("Oferta actualizada correctamente");
            setOpen(false);
        }
    };
    const [empresasDisponibles, setEmpresasDisponibles] = useState<Empresa[]>(empresas);

    useEffect(() => {
        if (empresas.length === 0) {
            const local = localStorage.getItem("empresas");
            const parsed = local ? JSON.parse(local) as Empresa[] : [];
            setEmpresasDisponibles(parsed);
        } else {
            setEmpresasDisponibles(empresas);
        }
    }, [empresas]);



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
                                        name="idEmpresa"
                                        value={formData.idEmpresa}
                                        onChange={(e) => {
                                            const selectedId = Number(e.target.value);
                                            const selectedEmpresa = empresasDisponibles.find(emp => emp.id === selectedId);
                                            setFormData({
                                                ...formData,
                                                idEmpresa: selectedId,
                                                empresaNombre: selectedEmpresa?.nombre || "",
                                            });
                                        }}
                                        className="w-full p-2 border rounded bg-white text-black dark:bg-neutral-800 dark:text-white dark:border-gray-700"
                                    >
                                        {empresasDisponibles.map((empresa) => (
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
                        <InputGroup
                            label="Fecha de Inicio"
                            name="fechaInicio"
                            value={formData.fechaInicio}
                            onChange={handleChange}
                            type="date"
                        />

                        <InputGroup
                            label="Carga Horaria"
                            name="horario"
                            value={formData.horario}
                            onChange={handleChange}
                        />

                    </TabsContent>

                    <TabsContent value="requisitos" className="space-y-4">
                        <InputGroup label="Vacantes" name="vacantes" type="number" value={formData.vacantes} onChange={handleChange} />
                        <InputGroup label="Experiencia" name="experiencia" value={formData.experiencia} onChange={handleChange} />
                        <InputGroup
                            label="Ubicación"
                            name="locacion"
                            value={formData.locacion}
                            onChange={handleChange}
                        />

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
                className="w-full p-2 border rounded bg-white text-black dark:bg-neutral-800 dark:text-white dark:border-gray-700"
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
