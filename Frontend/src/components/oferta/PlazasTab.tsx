import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OfertaModal from "./OfertaModal";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Oferta } from "@/types/Oferta";
import { Empresa } from "@/types/Empresa";

export default function PlazasTab({ isAdmin }: { isAdmin: boolean }) {
    const navigate = useNavigate();

    const [empresas, setEmpresas] = useState<Empresa[]>([
        { id: 1, nombre: "TechSolutions", ruc: "123456789", telefono: "987654321", email: "tech@empresa.com" },
        { id: 2, nombre: "InnovateCorp", ruc: "987654321", telefono: "987654321", email: "contacto@innovate.com" }
    ]);

    const [ofertas, setOfertas] = useState<Oferta[]>([
        {
            id: 1,
            titulo: "Desarrollador Frontend",
            tipo: "Empleo",
            funciones: "Desarrollo de interfaces de usuario con React.",
            requisitos: "Experiencia en React, TypeScript y TailwindCSS.",
            beneficios: "Trabajo remoto, seguro médico, bonos por desempeño.",
            area: "Desarrollo de Software",
            modalidad: "Remoto",
            carga_horaria: "40 horas/semana",
            vacantes: 2,
            experiencia: "2 años",
            ubigeo: "Lima, Perú",
            salario: "5000 PEN",
            empresa_id: 1,
            cerrada: false,
        },
        {
            id: 2,
            titulo: "Analista de Datos",
            tipo: "Práctica Profesional",
            funciones: "Análisis de datos y generación de reportes.",
            requisitos: "Conocimientos en SQL, Python y Power BI.",
            beneficios: "Prácticas remuneradas, posibilidad de contrato fijo.",
            area: "Ciencia de Datos",
            modalidad: "Presencial",
            carga_horaria: "30 horas/semana",
            vacantes: 1,
            experiencia: "0-1 año",
            ubigeo: "Arequipa, Perú",
            salario: "2000 PEN",
            empresa_id: 2,
            cerrada: false,
        },
    ]);

    const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);

    useEffect(() => {
        localStorage.setItem("ofertas", JSON.stringify(ofertas));
    }, [ofertas]);

    const handleSaveOferta = (oferta: Oferta) => {
        if (oferta.id) {
            setOfertas(ofertas.map((o) => (o.id === oferta.id ? oferta : o)));
        } else {
            const nuevaOferta = { ...oferta, id: ofertas.length + 1 };
            setOfertas([...ofertas, nuevaOferta]);
        }
        setSelectedOferta(null);
    };

    const handleSaveEmpresa = (empresa: Empresa) => {
        const nuevaEmpresa = { ...empresa, id: empresas.length + 1 };
        setEmpresas([...empresas, nuevaEmpresa]);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Plazas de Trabajo Disponibles</h2>
                <OfertaModal
                    onSave={handleSaveOferta}
                    empresas={empresas}
                    onSaveEmpresa={handleSaveEmpresa}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Modalidad</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ofertas.map((oferta) => (
                        <TableRow key={oferta.id}>
                            <TableCell>{oferta.titulo}</TableCell>
                            <TableCell>{oferta.tipo}</TableCell>
                            <TableCell>{oferta.modalidad}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/oferta/${oferta.id}`)}>
                                    Ver Oferta
                                </Button>
                                {isAdmin && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedOferta(oferta)}
                                    >
                                        Editar
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedOferta && (
                <OfertaModal
                    oferta={selectedOferta}
                    onSave={handleSaveOferta}
                    empresas={empresas}
                    onSaveEmpresa={handleSaveEmpresa}
                />
            )}
        </div>
    );
}
