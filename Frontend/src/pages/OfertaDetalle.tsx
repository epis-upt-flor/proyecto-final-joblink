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
import { getRoleFromToken } from "@/helpers/auth";

export default function OfertaDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [oferta, setOferta] = useState<Oferta | null>(null);
    const [egresados, setEgresados] = useState<Egresado[]>([]);
    const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
    const [openRecomendaciones, setOpenRecomendaciones] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = getRoleFromToken();
        console.log("Token:", token);
        console.log("Role:", role);
        console.log("ID de oferta:", id);
    
        if (!id) return;
    
        const ofertasGuardadasRaw = localStorage.getItem("ofertas");
        const ofertasGuardadas: Oferta[] = JSON.parse(ofertasGuardadasRaw || "[]");
        const ofertaSeleccionada = ofertasGuardadas.find((o) => o.id === Number(id));
    
        if (ofertaSeleccionada) {
            setOferta(ofertaSeleccionada);
        } else {
            const API_URL = import.meta.env.VITE_API_URL;
            fetch(`${API_URL}/oferta/${id}`)
                .then((res) => {
                    if (!res.ok) throw new Error("No se pudo cargar la oferta");
                    return res.json();
                })
                .then((data: Oferta) => {
                    console.log("🆕 Oferta cargada desde API:", data);
                    setOferta(data);
                })
                .catch((err) => {
                    console.error("❌ Error al obtener oferta:", err);
                    toast.error("Oferta no encontrada.");
                    navigate("/");
                });
            return;
        }

        const egresadosRaw = localStorage.getItem("egresados");
        console.log("📦 Egresados en localStorage:", egresadosRaw);

        let egresadosGuardados: Egresado[] = JSON.parse(egresadosRaw || "[]");
        if (egresadosGuardados.length === 0) {
            console.log("ℹ️ No hay egresados en localStorage, usando dummy.");
            egresadosGuardados = [ /* ...datos hardcodeados... */];
            localStorage.setItem("egresados", JSON.stringify(egresadosGuardados));
        }
        setEgresados(egresadosGuardados);

        const postulacionesRaw = localStorage.getItem("postulaciones");
        console.log("📦 Postulaciones en localStorage:", postulacionesRaw);

        const postulacionesGuardadas: Postulacion[] = JSON.parse(postulacionesRaw || "[]");
        const filtradas = postulacionesGuardadas.filter((p) => p.oferta_id === Number(id));
        console.log("📄 Postulaciones para esta oferta:", filtradas);

        setPostulaciones(filtradas);
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
                        const role = getRoleFromToken();
                        console.log("🔙 Volver presionado. Rol actual:", role);

                        if (role === "admin") {
                            navigate("/admin/dashboard");
                        } else if (role === "empresa") {
                            navigate("/empresa/dashboard");
                        } else {
                            console.warn("⚠️ Rol desconocido, redirigiendo al login");
                            navigate("/");
                        }
                    }}

                >
                    Volver
                </Button>

            </div>
        </div>
    );
}
