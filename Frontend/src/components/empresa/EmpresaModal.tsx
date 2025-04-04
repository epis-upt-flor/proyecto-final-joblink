import { Empresa } from "@/types/Empresa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useEmpresas } from "@/context/EmpresaContext";

export default function EmpresaModal({
  empresa,
  onSave,
  open,
  onOpenChange,
}: {
  empresa?: Empresa;
  onSave: (data: Empresa) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;
  const { crearEmpresa } = useEmpresas();
  const [formData, setFormData] = useState<Empresa>(
    empresa || { nombre: "", ruc: "", telefono: "", email: "", logo: "" }
  );

  useEffect(() => {
    if (empresa) setFormData(empresa);
  }, [empresa]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!empresa) {
      const success = await crearEmpresa(formData);
      if (success) {
        toast.success("Empresa registrada correctamente");
        setOpen(false);
      } else {
        toast.error("Error al registrar empresa");
      }
    } else {
      onSave(formData);
      toast.success("Empresa actualizada correctamente");
      setOpen(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!empresa && (
        <DialogTrigger asChild>
          <Button variant="default" onClick={() => setOpen(true)}>
            Registrar Empresa
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{empresa ? "Editar Empresa" : "Registrar Empresa"}</DialogTitle>
          <DialogDescription>Completa los datos de la empresa</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
          <Input name="ruc" value={formData.ruc} onChange={handleChange} placeholder="RUC" />
          <Input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
          <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <Input name="logo" value={formData.logo} onChange={handleChange} placeholder="Logo (URL)" />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
