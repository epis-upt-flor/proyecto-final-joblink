import { createContext, useContext, useEffect, useState } from "react";
import { Egresado } from "@/types/Egresado";

interface EgresadoContextType {
    egresados: Egresado[];
    setEgresados: React.Dispatch<React.SetStateAction<Egresado[]>>;
    loading: boolean;
    error: string | null;
    crearEgresado: (data: Egresado) => Promise<Egresado | null>;
    actualizarEgresado: (data: Egresado) => Promise<Egresado | null>;
    fetchEgresados: () => Promise<void>;
}

const EgresadoContext = createContext<EgresadoContextType | undefined>(undefined);

export const EgresadoProvider = ({ children }: { children: React.ReactNode }) => {
    const [egresados, setEgresados] = useState<Egresado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchEgresados = async () => {
        try {
            const local = localStorage.getItem("egresados");

            if (local) {
                const data = JSON.parse(local);
                setEgresados(data);
                setLoading(false);
                return;
            }

            const res = await fetch(`${API_URL}/egresados/`);
            if (!res.ok) throw new Error("Error al obtener egresados");
            const data: Egresado[] = await res.json();
            setEgresados(data);
            localStorage.setItem("egresados", JSON.stringify(data));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const actualizarEgresado = async (data: Egresado): Promise<Egresado | null> => {
        try {
            const res = await fetch(`${API_URL}/egresados/${data.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Error al actualizar egresado");

            const actualizado = await res.json();

            setEgresados(prev =>
                prev.map(e => (e.id === actualizado.id ? actualizado : e))
            );

            return actualizado;
        } catch (err) {
            console.error("Error actualizando egresado:", err);
            return null;
        }
    };

    const crearEgresado = async (data: Egresado): Promise<Egresado | null> => {
        try {
            const res = await fetch(`${API_URL}/egresados/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Error al crear egresado");
            }

            const nuevo = await res.json();
            const egresadoConId = { ...data, id: nuevo.id };

            setEgresados(prev => [...prev, egresadoConId]);
            return egresadoConId;
        } catch (err) {
            console.error("Error creando egresado:", err);
            return null;
        }
    };

    useEffect(() => {
        fetchEgresados();
    }, []);

    return (
        <EgresadoContext.Provider
            value={{
                egresados,
                setEgresados,
                loading,
                error,
                crearEgresado,
                actualizarEgresado,
                fetchEgresados,
            }}
        >
            {children}
        </EgresadoContext.Provider>
    );
};

export const useEgresados = () => {
    const ctx = useContext(EgresadoContext);
    if (!ctx) throw new Error("useEgresados debe usarse dentro de EgresadoProvider");
    return ctx;
};

