"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface FormacionTabProps {
    logro: string;
    setLogro: Dispatch<SetStateAction<string>>;
    logrosAcademicos: string[];
    setLogrosAcademicos: Dispatch<SetStateAction<string[]>>;
    certificado: string;
    setCertificado: Dispatch<SetStateAction<string>>;
    certificados: string[];
    setCertificados: Dispatch<SetStateAction<string[]>>;
    goToNext: () => void;
    goToPrevious: () => void;
}

export function FormacionTab({
    logro,
    setLogro,
    logrosAcademicos,
    setLogrosAcademicos,
    certificado,
    setCertificado,
    certificados,
    setCertificados,
    goToNext,
    goToPrevious,
}: FormacionTabProps) {
    const agregarLogro = () => {
        if (logro.trim() && !logrosAcademicos.includes(logro.trim())) {
            setLogrosAcademicos([...logrosAcademicos, logro.trim()]);
            setLogro("");
        }
    };

    const eliminarLogro = (index: number) => {
        setLogrosAcademicos(logrosAcademicos.filter((_, i) => i !== index));
    };

    const agregarCertificado = () => {
        if (certificado.trim() && !certificados.includes(certificado.trim())) {
            setCertificados([...certificados, certificado.trim()]);
            setCertificado("");
        }
    };

    const eliminarCertificado = (index: number) => {
        setCertificados(certificados.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div>
                <FormLabel>Logros Académicos</FormLabel>
                <div className="flex gap-2 mb-2">
                    <Input
                        placeholder="Agregar logro académico"
                        value={logro}
                        onChange={(e) => setLogro(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                agregarLogro();
                            }
                        }}
                    />
                    <Button type="button" size="sm" onClick={agregarLogro}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {logrosAcademicos.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => eliminarLogro(index)} />
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <FormLabel>Certificados</FormLabel>
                <div className="flex gap-2 mb-2">
                    <Input
                        placeholder="Agregar certificado"
                        value={certificado}
                        onChange={(e) => setCertificado(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                agregarCertificado();
                            }
                        }}
                    />
                    <Button type="button" size="sm" onClick={agregarCertificado}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {certificados.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => eliminarCertificado(index)} />
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
    );
}
