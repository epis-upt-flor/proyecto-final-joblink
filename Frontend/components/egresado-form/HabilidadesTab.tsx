"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface Idioma {
    idioma: string
    nivel: string
}

interface HabilidadesTabProps {
    habilidad: string
    setHabilidad: Dispatch<SetStateAction<string>>
    habilidades: string[]
    setHabilidades: Dispatch<SetStateAction<string[]>>
    nuevoIdioma: Idioma
    setNuevoIdioma: Dispatch<SetStateAction<Idioma>>
    idiomas: Idioma[]
    setIdiomas: Dispatch<SetStateAction<Idioma[]>>
    goToNext: () => void
    goToPrevious: () => void
}

export function HabilidadesTab({
    habilidad,
    setHabilidad,
    habilidades,
    setHabilidades,
    nuevoIdioma,
    setNuevoIdioma,
    idiomas,
    setIdiomas,
    goToNext,
    goToPrevious,
}: HabilidadesTabProps) {
    const agregarHabilidad = () => {
        const nueva = habilidad.trim()
        if (nueva && !habilidades.includes(nueva)) {
            setHabilidades([...habilidades, nueva])
            setHabilidad("")
        }
    }

    const eliminarHabilidad = (index: number) => {
        setHabilidades(habilidades.filter((_, i) => i !== index))
    }

    const agregarIdioma = () => {
        if (
            nuevoIdioma.idioma &&
            nuevoIdioma.nivel &&
            !idiomas.some(i => i.idioma === nuevoIdioma.idioma)
        ) {
            setIdiomas([...idiomas, nuevoIdioma])
            setNuevoIdioma({ idioma: "", nivel: "" })
        }
    }

    const eliminarIdioma = (index: number) => {
        setIdiomas(idiomas.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-6">
            <div>
                <FormLabel>Habilidades</FormLabel>
                <div className="flex gap-2 mb-2">
                    <Input
                        placeholder="Agregar habilidad"
                        value={habilidad}
                        onChange={(e) => setHabilidad(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                agregarHabilidad()
                            }
                        }}
                    />
                    <Button type="button" size="sm" onClick={agregarHabilidad}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {habilidades.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => eliminarHabilidad(index)} />
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <FormLabel>Idiomas</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <Select
                        value={nuevoIdioma.idioma}
                        onValueChange={(val) => setNuevoIdioma({ ...nuevoIdioma, idioma: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Inglés">Inglés</SelectItem>
                            <SelectItem value="Español">Español</SelectItem>
                            <SelectItem value="Francés">Francés</SelectItem>
                            <SelectItem value="Portugués">Portugués</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={nuevoIdioma.nivel}
                        onValueChange={(val) => setNuevoIdioma({ ...nuevoIdioma, nivel: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Básico">Básico</SelectItem>
                            <SelectItem value="Intermedio">Intermedio</SelectItem>
                            <SelectItem value="Avanzado">Avanzado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="button" size="sm" onClick={agregarIdioma}>
                    <Plus className="h-4 w-4 mr-1" /> Agregar Idioma
                </Button>
                <div className="flex flex-wrap gap-2 mt-2">
                    {idiomas.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item.idioma} - {item.nivel}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => eliminarIdioma(index)} />
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