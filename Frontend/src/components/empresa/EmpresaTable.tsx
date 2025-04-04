import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empresa } from "@/types/Empresa";
import AccionesEmpresa from "./AccionesEmpresa";

export default function EmpresasTable({
    empresas,
    onEdit,
}: {
    empresas: Empresa[];
    onEdit: (empresa: Empresa) => void;
    onView: (empresa: Empresa) => void;
}) {
    return (
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
                        <TableCell>
                            <AccionesEmpresa
                                empresaId={empresa.id!}
                                onEdit={() => onEdit(empresa)}
                            />

                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
