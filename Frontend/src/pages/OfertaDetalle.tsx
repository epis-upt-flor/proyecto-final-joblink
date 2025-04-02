import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Oferta } from "@/types/Oferta";
import { Egresado } from "@/types/Egresado";
import { Postulacion } from "@/types/Postulacion";
import { toast } from "sonner";

export default function OfertaDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [oferta, setOferta] = useState<Oferta | null>(null);
    const [egresados, setEgresados] = useState<Egresado[]>([]);
    const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
    const [openRecomendaciones, setOpenRecomendaciones] = useState(false);

    useEffect(() => {
        if (!id) return;

        const ofertasGuardadas: Oferta[] = JSON.parse(localStorage.getItem("ofertas") || "[]");
        const ofertaSeleccionada = ofertasGuardadas.find((o) => o.id === Number(id));

        if (ofertaSeleccionada) {
            setOferta(ofertaSeleccionada);
        } else {
            toast.error("Oferta no encontrada.");
            navigate("/");
            return;
        }

        let egresadosGuardados: Egresado[] = JSON.parse(localStorage.getItem("egresados") || "[]");
        if (egresadosGuardados.length === 0) {
            egresadosGuardados = [
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
                }
            ];
            localStorage.setItem("egresados", JSON.stringify(egresadosGuardados));
        }
        setEgresados(egresadosGuardados);

        const postulacionesGuardadas: Postulacion[] = JSON.parse(localStorage.getItem("postulaciones") || "[]");
        setPostulaciones(postulacionesGuardadas.filter((p) => p.oferta_id === Number(id)));
    }, [id, navigate]);

    const handlePostular = (egresado: Egresado) => {
        if (postulaciones.some((p) => p.egresado_id === egresado.id && p.oferta_id === Number(id))) {
            toast.warning(`El egresado ${egresado.nombre} ya está postulado.`);
            return;
        }

        const nuevaPostulacion: Postulacion = {
            id: Date.now(),
            egresado_id: egresado.id!,
            oferta_id: Number(id),
            estado: "pendiente",
        };

        const nuevasPostulaciones = [...postulaciones, nuevaPostulacion];
        setPostulaciones(nuevasPostulaciones);
        localStorage.setItem("postulaciones", JSON.stringify(nuevasPostulaciones));

        toast.success(`Egresado ${egresado.nombre} postulado correctamente.`);
    };

    if (!oferta) {
        return <p className="text-center">Cargando oferta...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>{oferta.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p><strong>Tipo:</strong> {oferta.tipo}</p>
                    <p><strong>Área:</strong> {oferta.area}</p>
                    <p><strong>Modalidad:</strong> {oferta.modalidad}</p>
                    <p><strong>Carga Horaria:</strong> {oferta.carga_horaria}</p>
                    <p><strong>Vacantes:</strong> {oferta.vacantes}</p>
                    <p><strong>Ubicación:</strong> {oferta.ubigeo}</p>
                    <p><strong>Salario:</strong> {oferta.salario || "No especificado"}</p>
                    <p><strong>Funciones:</strong> {oferta.funciones}</p>
                    <p><strong>Requisitos:</strong> {oferta.requisitos}</p>
                    <p><strong>Beneficios:</strong> {oferta.beneficios || "No especificado"}</p>

                    <div className="flex justify-end">
                        <Dialog open={openRecomendaciones} onOpenChange={setOpenRecomendaciones}>
                            <DialogTrigger asChild>
                                <Button variant="default" onClick={() => setOpenRecomendaciones(true)}>Recomendar Egresados</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Recomendar Egresados</DialogTitle>
                                </DialogHeader>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Habilidades</TableHead>
                                            <TableHead>Acción</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {egresados.map((egresado) => (
                                            <TableRow key={egresado.id}>
                                                <TableCell>{egresado.nombre} {egresado.apellido}</TableCell>
                                                <TableCell>{egresado.habilidades}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" onClick={() => handlePostular(egresado)}>
                                                        Postular
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        const role = localStorage.getItem("role");

                        if (role === "admin") {
                            navigate("/admin/dashboard");
                        } else if (role === "empresa") {
                            navigate("/empresa/dashboard");
                        } else {
                            // Si no hay rol o no es conocido, intenta ir atrás o al home
                            if (window.history.length > 2) {
                                navigate(-1);
                            } else {
                                navigate("/");
                            }
                        }
                    }}
                >
                    Volver
                </Button>

            </div>
        </div>
    );
}
