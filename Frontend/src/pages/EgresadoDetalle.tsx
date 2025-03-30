import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Egresado } from "@/types/Egresado";

export default function EgresadoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [egresado, setEgresado] = useState<Egresado | null>(null);

    useEffect(() => {
        const egresadosGuardados: Egresado[] = JSON.parse(localStorage.getItem("egresados") || "[]");
        const egresadoSeleccionado = egresadosGuardados.find((e) => e.id === Number(id));
        if (egresadoSeleccionado) {
            setEgresado(egresadoSeleccionado);
        } else {
            navigate("/");
        }
    }, [id, navigate]);

    if (!egresado) {
        return <p className="text-center">Cargando información del egresado...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>{egresado.nombre} {egresado.apellido}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p><strong>DNI:</strong> {egresado.dni}</p>
                    <p><strong>Teléfono:</strong> {egresado.telefono}</p>
                    <p><strong>Lugar de Nacimiento:</strong> {egresado.lugar_nacimiento}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {egresado.fecha_nacimiento}</p>
                    <p><strong>Nacionalidad:</strong> {egresado.nacionalidad}</p>
                    <p><strong>Correo:</strong> {egresado.correo}</p>
                    <p><strong>Dirección:</strong> {egresado.direccion}</p>
                    <p><strong>LinkedIn:</strong> <a href={egresado.linkedin} target="_blank" className="text-blue-500">{egresado.linkedin}</a></p>
                    <p><strong>GitHub:</strong> <a href={egresado.github} target="_blank" className="text-blue-500">{egresado.github}</a></p>
                    <p><strong>Habilidades:</strong> {egresado.habilidades}</p>
                    <p><strong>Experiencia Laboral:</strong> {egresado.experiencia_laboral}</p>
                    <p><strong>Certificados:</strong> {egresado.certificados}</p>
                    <p><strong>Idiomas:</strong> {egresado.idiomas}</p>
                    <p><strong>Proyectos:</strong> {egresado.proyectos}</p>
                </CardContent>
            </Card>
            <div className="mt-4">
                <Button variant="outline" onClick={() => navigate(-1)}>Volver</Button>
            </div>
        </div>
    );
}
