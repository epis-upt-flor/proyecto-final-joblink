import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empresa } from "@/types/Empresa";
import EmpresasTable from "./EmpresaTable";
import EmpresaModal from "./EmpresaModal";
import { useEmpresas } from "@/context/EmpresaContext";
import { toast } from "sonner";

export default function EmpresasTab() {
  const { empresas, setEmpresas, loading, error } = useEmpresas();
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  const handleSaveEmpresa = (empresa: Empresa) => {
    let nuevasEmpresas: Empresa[] = [];

    if (empresa.id) {
      nuevasEmpresas = empresas.map((e) =>
        e.id === empresa.id ? empresa : e
      );
    } else {
      const nueva = { ...empresa, id: Date.now() };
      nuevasEmpresas = [...empresas, nueva];
    }

    setEmpresas(nuevasEmpresas);
    localStorage.setItem("empresas", JSON.stringify(nuevasEmpresas));
    toast.success("Empresa guardada correctamente");
    setSelectedEmpresa(null);
  };


  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Empresas Registradas</CardTitle>
        <EmpresaModal onSave={handleSaveEmpresa} />
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Cargando empresas...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <EmpresasTable
            empresas={empresas}
            onEdit={(empresa) => setSelectedEmpresa(empresa)}
            onView={(empresa) =>
              alert(`👁 Ver detalles de ${empresa.nombre}`)
            }
          />
        )}
        {selectedEmpresa && (
          <EmpresaModal
            empresa={selectedEmpresa}
            onSave={handleSaveEmpresa}
            open={!!selectedEmpresa}
            onOpenChange={(val) => !val && setSelectedEmpresa(null)}
          />
        )}

      </CardContent>
    </Card>
  );
}
