import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function ReportesTab() {
    const [datosReportes, setDatosReportes] = useState({
        egresadosPostulados: 150,
        egresadosContratados: 60,
        tasaExito: 0,
        empresasContratantes: 20,
    });

    useEffect(() => {
        setDatosReportes((prev) => ({
            ...prev,
            tasaExito: (prev.egresadosContratados / prev.egresadosPostulados) * 100,
        }));
    }, []);

    const barData = {
        labels: ["Empresa A", "Empresa B", "Empresa C", "Empresa D", "Empresa E"],
        datasets: [
            {
                label: "Egresados Contratados",
                data: [12, 8, 15, 5, 10],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    const pieData = {
        labels: ["Presencial", "Remoto", "Híbrido"],
        datasets: [
            {
                label: "Modalidad de Trabajo",
                data: [40, 35, 25],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Métricas de Empleabilidad</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Egresados Postulados:</strong> {datosReportes.egresadosPostulados}</p>
                    <p><strong>Egresados Contratados:</strong> {datosReportes.egresadosContratados}</p>
                    <p><strong>Tasa de Éxito:</strong> {datosReportes.tasaExito.toFixed(2)}%</p>
                    <p><strong>Empresas Contratantes:</strong> {datosReportes.empresasContratantes}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contrataciones por Empresa</CardTitle>
                </CardHeader>
                <CardContent>
                    <Bar data={barData} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Distribución de Modalidad de Trabajo</CardTitle>
                </CardHeader>
                <CardContent>
                    <Pie data={pieData} />
                </CardContent>
            </Card>
        </div>
    );
}
