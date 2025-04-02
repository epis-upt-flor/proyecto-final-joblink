import { useOfertas } from "@/context/OfertasContext";
import { Empresa } from "@/types/Empresa";
import OfertaModal from "./OfertaModal";
import PlazasTable from "./PlazasTable";
import { useState } from "react";
import { Oferta } from "@/types/Oferta";

export default function PlazasTab({ isAdmin }: { isAdmin: boolean }) {
  const { ofertas, setOfertas, loading, error } = useOfertas(); // 👈 desde contexto
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);


  const handleSaveOferta = (oferta: Oferta) => {
    if (oferta.id) {
      setOfertas((prev) => prev.map((o) => (o.id === oferta.id ? oferta : o)));
    } else {
      const nueva = { ...oferta, id: ofertas.length + 1 };
      setOfertas((prev) => [...prev, nueva]);
    }
    setSelectedOferta(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Plazas de Trabajo Disponibles</h2>
        <OfertaModal
          onSave={handleSaveOferta}
          empresas={empresas}
          onSaveEmpresa={(e) => setEmpresas((prev) => [...prev, e])}
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando ofertas...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <PlazasTable
          ofertas={ofertas}
          isAdmin={isAdmin}
          onView={(id) => (window.location.href = `/oferta/${id}`)}
          onEdit={(oferta) => setSelectedOferta(oferta)}
        />
      )}

      {selectedOferta && (
        <OfertaModal
          oferta={selectedOferta}
          open={!!selectedOferta}
          onOpenChange={(val) => !val && setSelectedOferta(null)}
          onSave={handleSaveOferta}
          empresas={empresas}
          onSaveEmpresa={(e) => setEmpresas((prev) => [...prev, e])}
        />
      )}
    </div>
  );
}
