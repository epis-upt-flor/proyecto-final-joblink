import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlazasTab from "@/components/oferta/PlazasTab";
import EgresadosTab from "@/components/egresado/EgresadosTab";
import EmpresasTab from "@/components/empresa/EmpresasTab";
import AprobacionesTab from "@/components/AprobacionesTab";
import HistorialTab from "@/components/HistorialTab";
import ReportesTab from "@/components/reportes/ReportesTab";

export default function TabsSection() {
    const isAdmin = true;
    return (
        <Tabs defaultValue="plazas" className="w-full">
            <TabsList className="grid grid-cols-6 w-full max-w-3xl">
                <TabsTrigger value="plazas">Plazas</TabsTrigger>
                <TabsTrigger value="egresados">Egresados</TabsTrigger>
                <TabsTrigger value="empresas">Empresas</TabsTrigger>

                <TabsTrigger value="historial">Historial</TabsTrigger>
                <TabsTrigger value="reportes">Reportes</TabsTrigger>
            </TabsList>
            <TabsContent value="plazas"><PlazasTab isAdmin={isAdmin} /></TabsContent>
            <TabsContent value="egresados"><EgresadosTab /></TabsContent>
            <TabsContent value="empresas"><EmpresasTab /></TabsContent>
            <TabsContent value="aprobaciones"><AprobacionesTab /></TabsContent>
            <TabsContent value="historial"><HistorialTab /></TabsContent>
            <TabsContent value="reportes"><ReportesTab /></TabsContent>
        </Tabs>
    );
}
