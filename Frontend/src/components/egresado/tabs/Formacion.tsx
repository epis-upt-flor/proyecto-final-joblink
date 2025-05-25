import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Egresado } from "@/types/Egresado"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"

export default function Formacion({
    formData,
    setFormData
}: {
    formData: Egresado
    setFormData: React.Dispatch<React.SetStateAction<Egresado>>
}) {
    const [nuevaHabilidad, setNuevaHabilidad] = useState("")
    const [nuevoIdioma, setNuevoIdioma] = useState({ nombre: "", nivel: "Básico" })

    const parsearIdiomas = (texto: string) => {
        return texto.split(",")
            .map(i => i.trim())
            .filter(Boolean)
            .map(str => {
                const match = str.match(/(.*?)\s*\((.*?)\)/)
                return {
                    nombre: match?.[1]?.trim() ?? str,
                    nivel: match?.[2]?.trim() ?? "Básico"
                }
            })
    }

    return (
        <div className="space-y-4">
            {/* HABILIDADES */}
            <div>
                <Label>Habilidades</Label>
                <div className="flex gap-2 mb-2">
                    <Input
                        value={nuevaHabilidad}
                        onChange={(e) => setNuevaHabilidad(e.target.value)}
                        placeholder="Ej. React"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && nuevaHabilidad.trim()) {
                                setFormData(prev => ({
                                    ...prev,
                                    habilidades: [...(prev.habilidades?.split(",").filter(Boolean) || []), nuevaHabilidad].join(","),
                                }))
                                setNuevaHabilidad("")
                            }
                        }}
                    />
                    <Button
                        onClick={() => {
                            if (nuevaHabilidad.trim()) {
                                setFormData(prev => ({
                                    ...prev,
                                    habilidades: [...(prev.habilidades?.split(",").filter(Boolean) || []), nuevaHabilidad].join(","),
                                }))
                                setNuevaHabilidad("")
                            }
                        }}
                    >
                        Agregar
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.habilidades?.split(",").filter(Boolean).map((h, i) => (
                        <Badge
                            key={i}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => {
                                setFormData(prev => ({
                                    ...prev,
                                    habilidades: prev.habilidades?.split(",").filter(x => x.trim() !== h.trim()).join(",")
                                }))
                            }}
                        >
                            {h.trim()} ✕
                        </Badge>
                    ))}
                </div>
            </div>

            {/* IDIOMAS */}
            <div className="space-y-2">
                <Label>Idiomas</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Ej. Inglés"
                        value={nuevoIdioma.nombre}
                        onChange={(e) => setNuevoIdioma({ ...nuevoIdioma, nombre: e.target.value })}
                    />
                    <Select
                        value={nuevoIdioma.nivel}
                        onValueChange={(val) => setNuevoIdioma({ ...nuevoIdioma, nivel: val })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Básico">Básico</SelectItem>
                            <SelectItem value="Intermedio">Intermedio</SelectItem>
                            <SelectItem value="Avanzado">Avanzado</SelectItem>
                            <SelectItem value="Nativo">Nativo</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        type="button"
                        onClick={() => {
                            if (!nuevoIdioma.nombre) return
                            const nuevos = [
                                ...parsearIdiomas(formData.idiomas || ""),
                                nuevoIdioma
                            ]
                            setFormData({
                                ...formData,
                                idiomas: nuevos.map(i => `${i.nombre} (${i.nivel})`).join(", ")
                            })
                            setNuevoIdioma({ nombre: "", nivel: "Básico" })
                        }}
                    >
                        Agregar
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {parsearIdiomas(formData.idiomas || "").map((i, idx) => (
                        <Badge
                            key={idx}
                            className="cursor-pointer"
                            variant="outline"
                            onClick={() => {
                                const restantes = parsearIdiomas(formData.idiomas || "").filter((_, ix) => ix !== idx)
                                setFormData({
                                    ...formData,
                                    idiomas: restantes.map(i => `${i.nombre} (${i.nivel})`).join(", ")
                                })
                            }}
                        >
                            {i.nombre} ({i.nivel}) ✕
                        </Badge>
                    ))}
                </div>
            </div>

            <TextareaGroup
                label="Experiencia Laboral"
                name="experienciaLaboral"
                value={formData.experienciaLaboral || ""}
                onChange={(e) => setFormData({ ...formData, experienciaLaboral: e.target.value })}
            />
            <TextareaGroup
                label="Logros Académicos"
                name="logrosAcademicos"
                value={formData.logrosAcademicos || ""}
                onChange={(e) => setFormData({ ...formData, logrosAcademicos: e.target.value })}
            />
            <TextareaGroup
                label="Certificados"
                name="certificados"
                value={formData.certificados || ""}
                onChange={(e) => setFormData({ ...formData, certificados: e.target.value })}
            />
        </div>
    )
}

function TextareaGroup({
    label,
    name,
    value,
    onChange
}: {
    label: string
    name: string
    value: string
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>
}) {
    return (
        <div>
            <Label htmlFor={name}>{label}</Label>
            <Textarea id={name} name={name} value={value} onChange={onChange} required />
        </div>
    )
}
