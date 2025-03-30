import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import EgresadoModal from "@/components/egresado/EgresadoModal";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Egresado } from "@/types/Egresado";

export default function EgresadosTab() {
    const navigate = useNavigate();
    const [egresados, setEgresados] = useState<Egresado[]>([
        {
            id: 1,
            nombre: "Carlos",
            apellido: "Mendoza",
            dni: "12345678",
            telefono: "987654321",
            lugar_nacimiento: "Lima",
            fecha_nacimiento: "1995-06-15",
            nacionalidad: "Peruano",
            correo: "carlos.mendoza@email.com",
            direccion: "Av. Siempre Viva 123",
            linkedin: "https://linkedin.com/in/carlosmendoza",
            github: "https://github.com/carlosmendoza",
            habilidades: "React; Node.js; SQL",
            experiencia_laboral: "3 años como FullStack Developer",
            certificados: "Certificado AWS",
            idiomas: "Inglés Avanzado; Español Nativo",
            proyectos: "Sistema de gestión de ventas",
        },
        {
            id: 2,
            nombre: "Ana",
            apellido: "González",
            dni: "87654321",
            telefono: "945123456",
            lugar_nacimiento: "Arequipa",
            fecha_nacimiento: "1998-04-10",
            nacionalidad: "Peruana",
            correo: "ana.gonzalez@email.com",
            direccion: "Jr. Los Olivos 321",
            linkedin: "https://linkedin.com/in/anagonzalez",
            github: "https://github.com/anagonzalez",
            habilidades: "Python; Django; Docker",
            experiencia_laboral: "2 años en Backend Developer",
            certificados: "Certificado Python",
            idiomas: "Inglés Intermedio",
            proyectos: "Plataforma de e-learning",
        },
    ]);
    const [csvData, setCsvData] = useState<Egresado[]>([]);
    const [openPreview, setOpenPreview] = useState(false);

    const handleSaveEgresado = (egresado: Egresado) => {
        let updatedEgresados;
        if (egresado.id) {
            updatedEgresados = egresados.map((e) => (e.id === egresado.id ? egresado : e));
        } else {
            const nuevoEgresado = { ...egresado, id: egresados.length + 1 };
            updatedEgresados = [...egresados, nuevoEgresado];
        }
        setEgresados(updatedEgresados);
        localStorage.setItem("egresados", JSON.stringify(updatedEgresados));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedData = results.data as Egresado[];
                setCsvData(parsedData);
                setOpenPreview(true);
            },
            error: () => {
                toast.error("Error al procesar el archivo CSV.");
            },
        });
    };

    const handleImportData = () => {
        const newData = csvData.map((egresado, index) => ({
            ...egresado,
            id: egresados.length + index + 1,
        }));

        const updatedEgresados = [...egresados, ...newData];
        setEgresados(updatedEgresados);
        localStorage.setItem("egresados", JSON.stringify(updatedEgresados));

        setCsvData([]);
        setOpenPreview(false);
        toast.success("Egresados importados correctamente.");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Gestión de Egresados</h2>
                <div className="flex gap-2">
                    <EgresadoModal onSave={handleSaveEgresado} />
                    <Input type="file" accept=".csv" onChange={handleFileUpload} />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>DNI</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {egresados.map((egresado) => (
                        <TableRow key={egresado.id}>
                            <TableCell>{egresado.nombre} {egresado.apellido}</TableCell>
                            <TableCell>{egresado.dni}</TableCell>
                            <TableCell>{egresado.correo}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/egresado/${egresado.id}`)}>
                                    Ver Egresado
                                </Button>
                                <EgresadoModal egresado={egresado} onSave={handleSaveEgresado} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Previsualización de Datos CSV</DialogTitle>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Apellido</TableHead>
                                <TableHead>DNI</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Correo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {csvData.map((egresado, index) => (
                                <TableRow key={index}>
                                    <TableCell>{egresado.nombre}</TableCell>
                                    <TableCell>{egresado.apellido}</TableCell>
                                    <TableCell>{egresado.dni}</TableCell>
                                    <TableCell>{egresado.telefono}</TableCell>
                                    <TableCell>{egresado.correo}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpenPreview(false)}>Cancelar</Button>
                        <Button onClick={handleImportData}>Confirmar Importación</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
