"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { OfertaFormValues } from "./ofertaFormSchema"

interface DetallesTabProps {
    form: UseFormReturn<OfertaFormValues>
    funcion: string
    setFuncion: (value: string) => void
    funciones: string[]
    setFunciones: (value: string[]) => void
    beneficio: string
    setBeneficio: (value: string) => void
    beneficios: string[]
    setBeneficios: (value: string[]) => void
    goToPrevious: () => void
    goToNext: () => void
}

export function DetallesTab({
    form,
    funcion,
    setFuncion,
    funciones,
    setFunciones,
    beneficio,
    setBeneficio,
    beneficios,
    setBeneficios,
    goToPrevious,
    goToNext,
}: DetallesTabProps) {
    const agregarItem = (
        valor: string,
        items: string[],
        setItems: (v: string[]) => void,
        setValor: (v: string) => void
    ) => {
        const trimmed = valor.trim()
        if (trimmed && !items.includes(trimmed)) {
            setItems([...items, trimmed])
            setValor("")
        }
    }

    const eliminarItem = (
        index: number,
        items: string[],
        setItems: (v: string[]) => void
    ) => {
        setItems(items.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="fechaPubli"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha de Publicación</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fechaCierre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha de Cierre</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="fechaInicio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha de Inicio</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tiempo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duración (meses)</FormLabel>
                            <FormControl>
                                <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="estadoPubli"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Estado de Publicación</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione estado" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="PUBLICADA">Publicada</SelectItem>
                                <SelectItem value="NO_PUBLICADA">No Publicada</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div>
                <FormLabel>Funciones</FormLabel>
                <div className="flex gap-2 mb-2">
                    <Input
                        placeholder="Agregar función"
                        value={funcion}
                        onChange={(e) => setFuncion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                agregarItem(funcion, funciones, setFunciones, setFuncion)
                            }
                        }}
                    />
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => agregarItem(funcion, funciones, setFunciones, setFuncion)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {funciones.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => eliminarItem(index, funciones, setFunciones)} />
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <FormLabel>Beneficios</FormLabel>
                <div className="flex gap-2 mb-2">
                    <Input
                        placeholder="Agregar beneficio"
                        value={beneficio}
                        onChange={(e) => setBeneficio(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                agregarItem(beneficio, beneficios, setBeneficios, setBeneficio)
                            }
                        }}
                    />
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => agregarItem(beneficio, beneficios, setBeneficios, setBeneficio)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {beneficios.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => eliminarItem(index, beneficios, setBeneficios)} />
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPrevious}>
                    Anterior
                </Button>
                <Button type="button" onClick={goToNext}>
                    Siguiente
                </Button>
            </div>
        </div>
    )
}
