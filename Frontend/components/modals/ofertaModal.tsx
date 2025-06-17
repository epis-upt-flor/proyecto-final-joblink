// components/oferta-form/AgregarOfertaModal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { crearOferta, Oferta } from "@/api/ofertaApi";
import { useEmpresas } from "@/hooks/useEmpresas";

import { ofertaSchema, OfertaFormValues } from "@/components/oferta-form/ofertaFormSchema";
import { InformacionTab } from "@/components/oferta-form/InformacionTab";
import { DetallesTab } from "@/components/oferta-form/DetallesTab";
import { RequisitosTab } from "@/components/oferta-form/RequisitosTab";

interface AgregarOfertaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  empresaId?: number;
}

export function AgregarOfertaModal({
  open,
  onOpenChange,
  onSuccess,
  empresaId,
}: AgregarOfertaModalProps) {
  const { toast } = useToast();
  const { data: empresas, isLoading: empresasLoading } = useEmpresas();

  const [activeTab, setActiveTab] = useState("informacion");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [funciones, setFunciones] = useState<string[]>([]);
  const [beneficios, setBeneficios] = useState<string[]>([]);
  const [requisitos, setRequisitos] = useState<string[]>([]);

  const [funcion, setFuncion] = useState("");
  const [beneficio, setBeneficio] = useState("");
  const [requisito, setRequisito] = useState("");

  const form = useForm<OfertaFormValues>({
    resolver: zodResolver(ofertaSchema),
    defaultValues: {
      titulo: "",
      tipo: "TIEMPO_COMPLETO",
      area: "",
      modalidad: "PRESENCIAL",
      horario: "",
      vacantes: 1,
      experiencia: "",
      locacion: "",
      salario: 0,
      motivo: "",
      fechaInicio: "",
      tiempo: 0,
      fechaCierre: "",
      fechaPubli: new Date().toISOString().split("T")[0],
      estadoPubli: "PUBLICADA",
      idEmpresa: empresaId || undefined,
    },
  });

  const onSubmit = async (data: OfertaFormValues) => {
    try {
      setIsSubmitting(true);
      const payload: Partial<Oferta> = {
        ...data,
        funciones,
        beneficios,
        requisitos,
        estado: "PENDIENTE",
      };

      await crearOferta(payload);
      toast({ title: "Oferta agregada", description: "Oferta registrada exitosamente" });

      form.reset();
      setFunciones([]);
      setBeneficios([]);
      setRequisitos([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error al crear oferta:", error);
      toast({ title: "Error", description: "No se pudo crear la oferta", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Oferta</DialogTitle>
          <DialogDescription>Complete los datos de la oferta</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="informacion">Información</TabsTrigger>
                <TabsTrigger value="detalles">Detalles</TabsTrigger>
                <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
              </TabsList>

              <TabsContent value="informacion">
                <InformacionTab
                  form={form}
                  empresaId={empresaId}
                  empresas={empresas}
                  empresasLoading={empresasLoading}
                  goToNext={() => setActiveTab("detalles")}
                />
              </TabsContent>

              <TabsContent value="detalles">
                <DetallesTab
                  form={form}
                  funcion={funcion}
                  setFuncion={setFuncion}
                  funciones={funciones}
                  setFunciones={setFunciones}
                  beneficio={beneficio}
                  setBeneficio={setBeneficio}
                  beneficios={beneficios}
                  setBeneficios={setBeneficios}
                  goToPrevious={() => setActiveTab("informacion")}
                  goToNext={() => setActiveTab("requisitos")}
                />
              </TabsContent>

              <TabsContent value="requisitos">
                <RequisitosTab
                  form={form}
                  requisito={requisito}
                  setRequisito={setRequisito}
                  requisitos={requisitos}
                  setRequisitos={setRequisitos}
                  isSubmitting={isSubmitting}
                  goToPrevious={() => setActiveTab("detalles")}
                />
              </TabsContent>
            </Tabs>
          </form>
        </Form>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
