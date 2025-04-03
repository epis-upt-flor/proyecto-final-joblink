import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Oferta } from "@/types/Oferta";
import AccionesCell from "./AccionesCell";

export default function PlazasTable({
    ofertas,
    isAdmin,
    onView,
    onEdit,
}: {
    ofertas: Oferta[];
    isAdmin: boolean;
    onView: (id: number) => void;
    onEdit: (oferta: Oferta) => void;
}) {
    return (
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
                        <TableCell>
                            <AccionesCell
                                isAdmin={isAdmin}
                                onView={() => oferta.id !== undefined && onView(oferta.id)}
                                onEdit={() => onEdit(oferta)}
                            />

                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
