"use client";

import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { OfertaFormValues } from "./ofertaFormSchema";
import { useEmpresas } from "@/hooks/useEmpresas";
import { Empresa } from "@/api/empresaApi";

interface Props {
    form: UseFormReturn<OfertaFormValues>;
    empresaId?: number;
    empresas?: Empresa[];
    empresasLoading: boolean;
    goToNext: () => void;
}


const tipos = [
    "TIEMPO_COMPLETO",
    "MEDIO_TIEMPO",
    "PRACTICAS",
    "FREELANCE",
    "TEMPORAL",
    "PROYECTO",
];

const areas = [
    "Desarrollo de Software",
    "Infraestructura y Redes",
    "Seguridad Informática",
    "Análisis de Datos",
    "Inteligencia Artificial",
    "Diseño UX/UI",
    "Gestión de Proyectos",
    "Soporte Técnico",
    "Bases de Datos",
    "DevOps",
    "Otro",
];

const modalidades = ["PRESENCIAL", "REMOTO", "HIBRIDO"];

export function InformacionTab({ form, empresaId, empresas, empresasLoading, goToNext }: Props) {
   return (
        <div className="space-y-4 mt-4">
            <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Título de la Oferta</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Desarrollador Full Stack" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {!empresaId && (
                <FormField
                    control={form.control}
                    name="idEmpresa"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Empresa</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                defaultValue={field.value ? String(field.value) : undefined}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione empresa" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {empresasLoading ? (
                                        <SelectItem value="loading" disabled>
                                            Cargando empresas...
                                        </SelectItem>
                                    ) : (
                                        empresas?.map((empresa) => (
                                            <SelectItem key={empresa.id} value={empresa.id.toString()}>
                                                {empresa.nombre}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Contrato</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione tipo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {tipos.map((tipo) => (
                                        <SelectItem key={tipo} value={tipo}>
                                            {tipo.replace("_", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Área</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione área" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {areas.map((area) => (
                                        <SelectItem key={area} value={area}>
                                            {area}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="modalidad"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Modalidad</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione modalidad" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {modalidades.map((modalidad) => (
                                        <SelectItem key={modalidad} value={modalidad}>
                                            {modalidad}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="locacion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ubicación</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Lima, Perú" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="horario"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Horario</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Lunes a Viernes 9am-6pm" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="vacantes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vacantes</FormLabel>
                            <FormControl>
                                <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="salario"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Salario</FormLabel>
                            <FormControl>
                                <Input type="number" min={0} step={100} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="experiencia"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experiencia Requerida</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: 2 años en desarrollo web" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex justify-end">
                <Button type="button" onClick={goToNext}>
                    Siguiente
                </Button>
            </div>
        </div>
    );
}
