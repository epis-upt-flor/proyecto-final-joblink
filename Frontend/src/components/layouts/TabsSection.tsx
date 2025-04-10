import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlazasTab from "@/components/oferta/PlazasTab";
import EgresadosTab from "@/components/egresado/EgresadosTab";
import EmpresasTab from "@/components/empresa/EmpresasTab";
import HistorialTab from "@/components/historial/HistorialTab";
import ReportesTab from "@/components/reportes/ReportesTab";

interface TabsSectionProps {
    role: "admin" | "empresa";
}

export default function TabsSection({ role }: TabsSectionProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabQuery = searchParams.get("tab");

    const defaultTab = role === "admin" ? "plazas" : "plazas";
    const [activeTab, setActiveTab] = useState(tabQuery || defaultTab);

    useEffect(() => {
        if (!tabQuery) {
            setSearchParams({ tab: defaultTab });
        }
    }, [tabQuery, setSearchParams, defaultTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setSearchParams({ tab: value });
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
