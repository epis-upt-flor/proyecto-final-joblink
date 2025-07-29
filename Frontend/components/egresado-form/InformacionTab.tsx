"use client"

import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";

interface InformacionTabProps {
    form: any;
    setActiveTab: (tab: string) => void;
}

export function InformacionTab({ form, setActiveTab }: InformacionTabProps) {
    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="nombres" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl><Input placeholder="Nombres" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="apellidos" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl><Input placeholder="Apellidos" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="tipoDoc" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de Documento</FormLabel>
                        <FormControl><Input placeholder="DNI" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="numDoc" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Número de Documento</FormLabel>
                        <FormControl><Input placeholder="12345678" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="correo@ejemplo.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="telefono" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl><Input placeholder="999999999" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="fechaNacimiento" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fecha de Nacimiento</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

            </div>

        </div>
    );
}
