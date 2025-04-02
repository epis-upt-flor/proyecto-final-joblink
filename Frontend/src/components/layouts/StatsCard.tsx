import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Building2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    {
        title: "Total Egresados",
        value: "1,248",
        icon: Users,
        iconBg: "bg-blue-100 text-blue-600",
    },
    {
        title: "Plazas Activas",
        value: "64",
        icon: Briefcase,
        iconBg: "bg-green-100 text-green-600",
    },
    {
        title: "Empresas Asociadas",
        value: "32",
        icon: Building2,
        iconBg: "bg-yellow-100 text-yellow-600",
    },
    {
        title: "Tasa de Éxito",
        value: "78%",
        icon: ArrowUpRight,
        iconBg: "bg-purple-100 text-purple-600",
    },
];

export default function StatsCards() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="shadow-sm hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div
                            className={cn(
                                "p-2 rounded-full",
                                stat.iconBg
                            )}
                        >
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold text-foreground">
                            {stat.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
