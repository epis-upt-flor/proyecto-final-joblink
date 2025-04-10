import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Egresado } from "@/types/Egresado"
import AccionesEgresado from "./AccionesEgresado"

export default function EgresadosTable({
    egresados,
    onEdit,
}: {
    egresados: Egresado[]
    onEdit: (egresado: Egresado) => void
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {egresados.map((e) => (
                    <TableRow key={e.id}>
                        <TableCell>{e.nombres} {e.apellidos}</TableCell>
                        <TableCell>{e.numDoc}</TableCell>
                        <TableCell>{e.email}</TableCell>
                        <TableCell>{e.telefono}</TableCell>
                        <TableCell className="flex gap-2">
                            <AccionesEgresado
                                egresadoId={e.id!}
                                onEdit={() => onEdit(e)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
