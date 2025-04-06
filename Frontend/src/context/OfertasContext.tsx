import { createContext, useContext, useEffect, useState } from "react";
import { Oferta } from "@/types/Oferta";

interface OfertasContextType {
  ofertas: Oferta[];
  setOfertas: React.Dispatch<React.SetStateAction<Oferta[]>>;
  loading: boolean;
  error: string | null;
  crearOferta: (oferta: Partial<Oferta>) => Promise<boolean>;
}

const OfertasContext = createContext<OfertasContextType | undefined>(undefined);

export const OfertasProvider = ({ children }: { children: React.ReactNode }) => {
  const [ofertas, setOfertas] = useState<Oferta[]>(() => {
    const stored = localStorage.getItem("ofertas");
    return stored ? JSON.parse(stored) : [];
  });

  const [loading, setLoading] = useState(ofertas.length === 0);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOfertas = async () => {
    try {
      const res = await fetch(`${API_URL}/ofertas/`);
      if (!res.ok) throw new Error("Error al obtener ofertas");
      const data: Oferta[] = await res.json();
      setOfertas(data);
      localStorage.setItem("ofertas", JSON.stringify(data));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const crearOferta = async (oferta: Partial<Oferta>): Promise<boolean> => {
    try {
      if (!oferta.idEmpresa) throw new Error("Empresa no seleccionada");

      const payload = {
        titulo: oferta.titulo,
        tipo: oferta.tipo,
        area: oferta.area,
        modalidad: oferta.modalidad,
        horario: oferta.horario,
        vacantes: Number(oferta.vacantes),
        experiencia: oferta.experiencia === "true" || oferta.experiencia === "true",
        locacion: oferta.locacion,
        salario: Number(oferta.salario),
        funciones: oferta.funciones,
        requisitos: oferta.requisitos,
        beneficios: oferta.beneficios,
        fechaInicio: oferta.fechaInicio,
        tiempo: Number(oferta.tiempo),
        idEmpresa: oferta.idEmpresa,
        estado: "pendiente",
        fechaPubli: new Date().toISOString().split("T")[0],
      };

      const res = await fetch(`${API_URL}/ofertas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error al registrar la oferta");
      }

      await fetchOfertas();
      return true;
    } catch (err) {
      console.error("❌ Error creando oferta:", err);
      return false;
    }
  };


  useEffect(() => {
    if (ofertas.length === 0) fetchOfertas();
  }, []);

  return (
    <OfertasContext.Provider value={{ ofertas, setOfertas, loading, error, crearOferta }}>
      {children}
    </OfertasContext.Provider>
  );
};

export const useOfertas = () => {
  const ctx = useContext(OfertasContext);
  if (!ctx) throw new Error("useOfertas debe usarse dentro de OfertasProvider");
  return ctx;
};
