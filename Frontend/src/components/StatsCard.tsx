import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Building2, ArrowUpRight } from "lucide-react";

export default function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[{ title: "Total Egresados", value: "1,248", icon: <Users /> }, { title: "Plazas Activas", value: "64", icon: <Briefcase /> }, { title: "Empresas Asociadas", value: "32", icon: <Building2 /> }, { title: "Tasa de Éxito", value: "78%", icon: <ArrowUpRight /> }].map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
