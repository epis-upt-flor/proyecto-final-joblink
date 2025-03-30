import { useState } from "react";
import EmpresaModal from "./EmpresaModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empresa } from "@/types/Empresa";

export default function EmpresasTab() {
    const [empresas, setEmpresas] = useState<Empresa[]>([
        { id: 1, nombre: "TechSolutions", ruc: "123456789", telefono: "987654321", email: "contacto@tech.com", logo: "" }
    ]);
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

    const handleSaveEmpresa = (empresa: Empresa) => {
        if (empresa.id) {
            setEmpresas(empresas.map((e) => (e.id === empresa.id ? empresa : e)));
        } else {
            const nuevaEmpresa = { ...empresa, id: empresas.length + 1 };
            setEmpresas([...empresas, nuevaEmpresa]);
        }
        setSelectedEmpresa(null);
    };

    const handleEditEmpresa = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
    };

    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Empresas Registradas</CardTitle>
                <EmpresaModal onSave={handleSaveEmpresa} />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>RUC</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {empresas.map((empresa) => (
                            <TableRow key={empresa.id}>
                                <TableCell>{empresa.nombre}</TableCell>
                                <TableCell>{empresa.ruc}</TableCell>
                                <TableCell>{empresa.telefono}</TableCell>
                                <TableCell>{empresa.email}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button onClick={() => handleEditEmpresa(empresa)}>Editar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            {selectedEmpresa && (
                <EmpresaModal empresa={selectedEmpresa} onSave={handleSaveEmpresa} />
            )}
        </Card>
    );
}
