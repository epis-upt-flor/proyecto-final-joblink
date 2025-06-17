// components/oferta-form/RequisitosTab.tsx
"use client";

import {
    FormLabel,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { OfertaFormValues } from "./ofertaFormSchema";

interface RequisitosTabProps {
    form: UseFormReturn<OfertaFormValues>;
    requisito: string;
    setRequisito: (val: string) => void;
    requisitos: string[];
    setRequisitos: (val: string[]) => void;
    isSubmitting: boolean;
    goToPrevious: () => void;
}

export function RequisitosTab({
    form,
    requisito,
    setRequisito,
    requisitos,
    setRequisitos,
    isSubmitting,
    goToPrevious,
}: RequisitosTabProps) {
    const agregarRequisito = () => {
        const nuevo = requisito.trim();
        if (nuevo && !requisitos.includes(nuevo)) {
            setRequisitos([...requisitos, nuevo]);
            setRequisito("");
        }
    };

    const eliminarRequisito = (index: number) => {
        setRequisitos(requisitos.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4 mt-4">
            <div>
                <FormLabel>Requisitos</FormLabel>
                <div className="flex gap-2 mb-2">
                    <Input
                        placeholder="Agregar requisito"
                        value={requisito}
                        onChange={(e) => setRequisito(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                agregarRequisito();
                            }
                        }}
                    />
                    <Button type="button" size="sm" onClick={agregarRequisito}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {requisitos.map((item, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {item}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => eliminarRequisito(index)}
                            />
                        </Badge>
                    ))}
                </div>
            </div>

            <FormField
                control={form.control}
                name="motivo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Motivo de la Contratación (opcional)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Explique el motivo de la contratación"
                                className="resize-none min-h-[100px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPrevious}>
                    Anterior
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Guardar Oferta
                </Button>
            </div>
        </div>
    );
}
