"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { crearEgresado, EgresadoInput } from "@/api/egresadoApi";
import { InformacionTab } from "@/components/egresado-form/InformacionTab";
import { HabilidadesTab } from "@/components/egresado-form/HabilidadesTab";
import { FormacionTab } from "@/components/egresado-form/FormacionTab";
import { ExperienciaTab } from "@/components/egresado-form/ExperienciaTab";
import { Button } from "@/components/ui/button";

const egresadoSchema = z.object({
    nombres: z.string().min(2),
    apellidos: z.string().min(2),
    tipoDoc: z.enum(["DNI", "PASAPORTE", "CARNET_EXT"]),
    numDoc: z.string().min(1),
    email: z.string().email(),
    telefono: z.string().min(1),
    fechaNacimiento: z.string().min(1),
    direccion: z.string().optional(),
    nacionalidad: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    disponibilidad: z.boolean().default(true),
});

interface Experiencia {
    empresa: string;
    puesto: string;
    periodo: string;
    responsabilidades: string[];
}

type EgresadoFormValues = z.infer<typeof egresadoSchema>;

interface AgregarEgresadoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function AgregarEgresadoModal({ open, onOpenChange, onSuccess }: AgregarEgresadoModalProps) {
    const { toast } = useToast();
    const form = useForm<EgresadoFormValues>({
        resolver: zodResolver(egresadoSchema),
        defaultValues: {
            nombres: "",
            apellidos: "",
            tipoDoc: "DNI",
            numDoc: "",
            email: "",
            telefono: "",
            fechaNacimiento: "",
            direccion: "",
            nacionalidad: "",
            linkedin: "",
            github: "",
            disponibilidad: true,
        },
    });

    const [activeTab, setActiveTab] = useState("informacion");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [habilidad, setHabilidad] = useState("");
    const [habilidades, setHabilidades] = useState<string[]>([]);
    const [nuevoIdioma, setNuevoIdioma] = useState({ idioma: "", nivel: "" });
    const [idiomas, setIdiomas] = useState<{ idioma: string; nivel: string }[]>([]);
    const [logro, setLogro] = useState("");
    const [logrosAcademicos, setLogrosAcademicos] = useState<string[]>([]);
    const [certificado, setCertificado] = useState("");
    const [certificados, setCertificados] = useState<string[]>([]);
    const [experiencias, setExperiencias] = useState<{
        empresa: string;
        puesto: string;
        periodo: string;
        responsabilidades: string[];
    }[]>([]);
    const [nuevaExperiencia, setNuevaExperiencia] = useState<Experiencia>({
        empresa: "",
        puesto: "",
        periodo: "",
        responsabilidades: [],
    });

    const [responsabilidad, setResponsabilidad] = useState("");

    const onSubmit = async (data: EgresadoFormValues) => {
        console.log("ERRORES:", form.formState.errors);
        console.log("SUBMIT:", data);

        try {
            setIsSubmitting(true);

            const payload: EgresadoInput = {
                ...data,
                habilidades,
                idiomas,
                logrosAcademicos,
                certificados,
                experienciaLaboral: experiencias,
            };


            await crearEgresado(payload).then((response) => {
                console.log("Egresado creado:", response);
            });


            toast({
                title: "Egresado agregado",
                description: "El egresado ha sido registrado exitosamente",
            });

            form.reset();
            setHabilidades([]);
            setIdiomas([]);
            setLogrosAcademicos([]);
            setCertificados([]);
            setExperiencias([]);
            onOpenChange(false);
            onSuccess?.();

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudo registrar el egresado",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Egresado</DialogTitle>
                    <DialogDescription>Complete todos los campos del formulario</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="informacion">Información</TabsTrigger>
                                <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
                                <TabsTrigger value="formacion">Formación</TabsTrigger>
                                <TabsTrigger value="experiencia">Experiencia</TabsTrigger>
                            </TabsList>

                            <TabsContent value="informacion">
                                <InformacionTab
                                    form={form}
                                    setActiveTab={setActiveTab}
                                />
                            </TabsContent>

                            <TabsContent value="habilidades">
                                <HabilidadesTab
                                    habilidad={habilidad}
                                    setHabilidad={setHabilidad}
                                    habilidades={habilidades}
                                    setHabilidades={setHabilidades}
                                    nuevoIdioma={nuevoIdioma}
                                    setNuevoIdioma={setNuevoIdioma}
                                    idiomas={idiomas}
                                    setIdiomas={setIdiomas}
                                    goToNext={() => setActiveTab("formacion")}
                                    goToPrevious={() => setActiveTab("informacion")}
                                />
                            </TabsContent>

                            <TabsContent value="formacion">
                                <FormacionTab
                                    logro={logro}
                                    setLogro={setLogro}
                                    logrosAcademicos={logrosAcademicos}
                                    setLogrosAcademicos={setLogrosAcademicos}
                                    certificado={certificado}
                                    setCertificado={setCertificado}
                                    certificados={certificados}
                                    setCertificados={setCertificados}
                                    goToNext={() => setActiveTab("experiencia")}
                                    goToPrevious={() => setActiveTab("habilidades")}
                                />
                            </TabsContent>

                            <TabsContent value="experiencia">
                                <ExperienciaTab
                                    experiencias={experiencias}
                                    setExperiencias={setExperiencias}
                                    nuevaExperiencia={nuevaExperiencia}
                                    setNuevaExperiencia={setNuevaExperiencia}
                                    responsabilidad={responsabilidad}
                                    setResponsabilidad={setResponsabilidad}
                                    goToPrevious={() => setActiveTab("formacion")}
                                    isSubmitting={isSubmitting}
                                />

                            </TabsContent>
                            <div className="flex justify-end mt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <span className="animate-spin mr-2">⏳</span>} Guardar Egresado
                                </Button>
                            </div>

                        </Tabs>
                    </form>
                </Form>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}