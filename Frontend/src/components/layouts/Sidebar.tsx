import { GraduationCap, BarChart3, Users, Briefcase, Settings, History, BarChart4, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-background border-r transition-all duration-300 hidden md:block`}>
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-4 border-b">
          <GraduationCap className="h-6 w-6 text-primary" />
          {sidebarOpen && <span className="ml-2 font-bold text-lg">LinkJob</span>}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[{ icon: <BarChart3 />, label: "Dashboard" }, { icon: <Users />, label: "Egresados" }, { icon: <Briefcase />, label: "Plazas" }, { icon: <Building2 />, label: "Empresas" }, { icon: <History />, label: "Historial" }, { icon: <BarChart4 />, label: "Reportes" }, { icon: <Settings />, label: "Configuración" }].map((item, index) => (
            <Button key={index} variant="ghost" className={`w-full justify-${sidebarOpen ? "start" : "center"} gap-3`}>
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" size="sm" className="w-full" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "Contraer" : "Expandir"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
