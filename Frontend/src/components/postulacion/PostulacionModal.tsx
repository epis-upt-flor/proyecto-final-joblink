import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Egresado } from "@/types/Egresado";
import { Postulacion } from "@/types/Postulacion";

export default function PostulacionModal({
    ofertaId,
    egresados,
    onPostular,
}: {
    ofertaId: number;
    egresados: Egresado[];
    onPostular: (data: Postulacion) => void;
}) {
    const [selectedEgresado, setSelectedEgresado] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const handlePostular = () => {
        if (!selectedEgresado) {
            toast.error("Selecciona un egresado para postular.");
            return;
        }

        const nuevaPostulacion: Postulacion = {
            id: Date.now(),
            egresado_id: selectedEgresado,
            oferta_id: ofertaId,
            estado: "pendiente",
        };

        onPostular(nuevaPostulacion);
        toast.success("Egresado postulado correctamente.");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" onClick={() => setOpen(true)}>Postular Egresado</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Postular Egresado</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Selecciona un Egresado</Label>
                        <Select onValueChange={(value) => setSelectedEgresado(Number(value))}>
                            {egresados.map((egresado) => (
                                <SelectItem key={egresado.id} value={egresado.id!.toString()}>
                                    {egresado.nombre} {egresado.apellido} - {egresado.dni}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handlePostular}>Postular</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
