"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Experiencia {
  empresa: string;
  puesto: string;
  periodo: string;
  responsabilidades: string[];
}

interface ExperienciaTabProps {
  experiencias: Experiencia[];
  setExperiencias: Dispatch<SetStateAction<Experiencia[]>>;
  nuevaExperiencia: Experiencia;
  setNuevaExperiencia: Dispatch<SetStateAction<Experiencia>>;
  responsabilidad: string;
  setResponsabilidad: Dispatch<SetStateAction<string>>;
  goToPrevious: () => void;
  isSubmitting: boolean;
}

export function ExperienciaTab({
  experiencias,
  setExperiencias,
  nuevaExperiencia,
  setNuevaExperiencia,
  responsabilidad,
  setResponsabilidad,
  goToPrevious,
  isSubmitting,
}: ExperienciaTabProps) {
  const agregarResponsabilidad = () => {
    if (responsabilidad.trim()) {
      setNuevaExperiencia({
        ...nuevaExperiencia,
        responsabilidades: [...nuevaExperiencia.responsabilidades, responsabilidad.trim()],
      });
      setResponsabilidad("");
    }
  };

  const eliminarResponsabilidad = (index: number) => {
    const updated = nuevaExperiencia.responsabilidades.filter((_, i) => i !== index);
    setNuevaExperiencia({ ...nuevaExperiencia, responsabilidades: updated });
  };

  const agregarExperiencia = () => {
    if (nuevaExperiencia.empresa && nuevaExperiencia.puesto && nuevaExperiencia.periodo) {
      setExperiencias([...experiencias, nuevaExperiencia]);
      setNuevaExperiencia({ empresa: "", puesto: "", periodo: "", responsabilidades: [] });
    }
  };

  const eliminarExperiencia = (index: number) => {
    setExperiencias(experiencias.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="border p-4 rounded-md space-y-4">
        <Input placeholder="Empresa" value={nuevaExperiencia.empresa} onChange={(e) => setNuevaExperiencia({ ...nuevaExperiencia, empresa: e.target.value })} />
        <Input placeholder="Puesto" value={nuevaExperiencia.puesto} onChange={(e) => setNuevaExperiencia({ ...nuevaExperiencia, puesto: e.target.value })} />
        <Input placeholder="Periodo (Ej: Ene 2020 - Dic 2022)" value={nuevaExperiencia.periodo} onChange={(e) => setNuevaExperiencia({ ...nuevaExperiencia, periodo: e.target.value })} />

        <div>
          <FormLabel>Responsabilidades</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Agregar responsabilidad"
              value={responsabilidad}
              onChange={(e) => setResponsabilidad(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarResponsabilidad();
                }
              }}
            />
            <Button type="button" size="sm" onClick={agregarResponsabilidad}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {nuevaExperiencia.responsabilidades.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <X className="h-3 w-3 cursor-pointer" onClick={() => eliminarResponsabilidad(index)} />
              </Badge>
            ))}
          </div>
        </div>

        <Button type="button" onClick={agregarExperiencia}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Experiencia
        </Button>
      </div>

      {experiencias.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Experiencias Agregadas:</h4>
          {experiencias.map((exp, index) => (
            <div key={index} className="border rounded-md p-3 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => eliminarExperiencia(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-medium">Empresa:</span> {exp.empresa}</div>
                <div><span className="font-medium">Puesto:</span> {exp.puesto}</div>
                <div><span className="font-medium">Periodo:</span> {exp.periodo}</div>
              </div>
              <ul className="mt-2 list-disc list-inside">
                {exp.responsabilidades.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-start">
        <Button type="button" variant="outline" onClick={goToPrevious}>
          Anterior
        </Button>
      </div>

    </div>
  );
}
