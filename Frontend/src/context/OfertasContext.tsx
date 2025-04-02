import { createContext, useContext, useEffect, useState } from "react";
import { Oferta } from "@/types/Oferta";

interface OfertasContextType {
  ofertas: Oferta[];
  setOfertas: React.Dispatch<React.SetStateAction<Oferta[]>>;
  loading: boolean;
  error: string | null;
}

const OfertasContext = createContext<OfertasContextType | undefined>(undefined);

export const OfertasProvider = ({ children }: { children: React.ReactNode }) => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchAndMergeOfertas = async () => {
      try {
        const res = await fetch(`${API_URL}/ofertas/`);
        if (!res.ok) throw new Error("Error al obtener las ofertas");
        const data: Oferta[] = await res.json();

        setOfertas((prev) => {
          const existing = new Set(prev.map((o) => o.id));
          const nuevas = data.filter((o) => !existing.has(o.id));
          return [...prev, ...nuevas];
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMergeOfertas();
    const interval = setInterval(fetchAndMergeOfertas, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <OfertasContext.Provider value={{ ofertas, setOfertas, loading, error }}>
      {children}
    </OfertasContext.Provider>
  );
};

export const useOfertas = () => {
  const context = useContext(OfertasContext);
  if (!context) throw new Error("useOfertas debe usarse dentro de OfertasProvider");
  return context;
};
