import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HistorialContratacion } from "@/types/HistorialContratacion";
import { Egresado } from "@/types/Egresado";

export default function HistorialTab() {
    const [historial, setHistorial] = useState<HistorialContratacion[]>([]);
    const [egresados, setEgresados] = useState<Egresado[]>([]);

    useEffect(() => {
        const egresadosDemo: Egresado[] = [
            {
                id: 1,
                nombres: "Carlos",
                apellidos: "Mendoza",
                tipoDoc: "DNI",
                numDoc: "12345678",
                telefono: "987654321",
                fechaNacimiento: "1995-06-15",
                nacionalidad: "Peruano",
                email: "carlos.mendoza@email.com",
                direccion: "Av. Siempre Viva 123",
                linkedin: "https://linkedin.com/in/carlosmendoza",
                github: "https://github.com/carlosmendoza",
                habilidades: "React; Node.js; SQL",
                experienciaLaboral: "3 años como FullStack Developer",
                certificados: "Certificado AWS",
                idiomas: "Inglés Avanzado; Español Nativo",
            },
            {
                id: 2,
                nombres: "Ana",
                apellidos: "González",
                tipoDoc: "DNI",
                numDoc: "87654321",
                telefono: "945123456",
                fechaNacimiento: "1998-04-10",
                nacionalidad: "Peruana",
                email: "ana.gonzalez@email.com",
                direccion: "Jr. Los Olivos 321",
                linkedin: "https://linkedin.com/in/anagonzalez",
                github: "https://github.com/anagonzalez",
                habilidades: "Python; Django; Docker",
                experienciaLaboral: "2 años en Backend Developer",
                certificados: "Certificado Python",
                idiomas: "Inglés Intermedio",
            },
        ];

        const historialDemo: HistorialContratacion[] = [
            {
                id: 1,
                egresado_id: 1,
                oferta_id: 10,
                empresa: "TechSolutions",
                fecha_contratacion: "2024-03-10",
            },
            {
                id: 2,
                egresado_id: 2,
                oferta_id: 11,
                empresa: "Innovate Inc.",
                fecha_contratacion: "2024-02-25",
            },
        ];

        setEgresados(egresadosDemo);
        setHistorial(historialDemo);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Historial de Contrataciones</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Fecha de Contratación</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {historial.map((contrato) => {
                            const egresado = egresados.find((e) => e.id === contrato.egresado_id);
                            return (
                                <TableRow key={contrato.id}>
                                    <TableCell>{egresado ? `${egresado.nombres} ${egresado.apellidos}` : "Desconocido"}</TableCell>
                                    <TableCell>{contrato.empresa}</TableCell>
                                    <TableCell>{contrato.fecha_contratacion}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
