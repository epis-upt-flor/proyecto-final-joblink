import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEgresados } from "@/context/EgresadoContext"
import { useState } from "react"
import { Egresado } from "@/types/Egresado"
import EgresadoModal from "./EgresadoModal"
import EgresadosTable from "./EgresadosTable"
import { toast } from "sonner"

export default function EgresadosTab() {
    const { egresados, setEgresados } = useEgresados()
    const [selectedEgresado, setSelectedEgresado] = useState<Egresado | null>(null)

    const handleSaveEgresado = (data: Egresado) => {
        let nuevaLista: Egresado[] = [];

        if (egresados.find(e => e.id === data.id)) {
            nuevaLista = egresados.map(e => e.id === data.id ? data : e);
            toast.success("Egresado actualizado correctamente");
        } else {
            nuevaLista = [...egresados, data];
            toast.success("Egresado registrado correctamente");
        }

        setEgresados(nuevaLista);
        localStorage.setItem("egresados", JSON.stringify(nuevaLista));
        setSelectedEgresado(null);
    };




    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Egresados Registrados</CardTitle>
                <EgresadoModal onSave={handleSaveEgresado} />
            </CardHeader>
            <CardContent>
                <EgresadosTable egresados={egresados} onEdit={(e) => setSelectedEgresado(e)} />
                {selectedEgresado && (
                    <EgresadoModal
                        egresado={selectedEgresado}
                        onSave={handleSaveEgresado}
                        open={!!selectedEgresado}
                        onOpenChange={(val) => !val && setSelectedEgresado(null)}
                    />
                )}
            </CardContent>
        </Card>
    )
}
