import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlazasTab from "@/components/oferta/PlazasTab";
import EgresadosTab from "@/components/egresado/EgresadosTab";
import EmpresasTab from "@/components/empresa/EmpresasTab";
import AprobacionesTab from "@/components/AprobacionesTab";
import HistorialTab from "@/components/historial/HistorialTab";
import ReportesTab from "@/components/reportes/ReportesTab";
interface TabsSectionProps {
    role: "admin" | "empresa";
}
export default function TabsSection({ role }: TabsSectionProps) {
    console.log("Rol recibido: ",role);
    return (
        <Tabs defaultValue="plazas" className="w-full">
            <TabsList className="flex justify-center bg-background rounded-md shadow p-2">
                <TabsTrigger value="plazas">Plazas</TabsTrigger>
                {role === "admin" && (
                    <>
                        <TabsTrigger value="egresados">Egresados</TabsTrigger>
                        <TabsTrigger value="empresas">Empresas</TabsTrigger>
                        <TabsTrigger value="historial">Historial</TabsTrigger>
                        <TabsTrigger value="reportes">Reportes</TabsTrigger>
                    </>
                )}
            </TabsList>

            <TabsContent value="plazas">
                <PlazasTab isAdmin={role === "admin"} />
            </TabsContent>
            {role === "admin" && (
                <>
                    <TabsContent value="egresados">
                        <EgresadosTab />
                    </TabsContent>
                    <TabsContent value="empresas">
                        <EmpresasTab />
                    </TabsContent>
                    <TabsContent value="historial">
                        <HistorialTab />
                    </TabsContent>
                    <TabsContent value="reportes">
                        <ReportesTab />
                    </TabsContent>
                </>
            )}
        </Tabs>
    );
}