import { createContext, useContext, useEffect, useState } from "react";
import { Empresa } from "@/types/Empresa";

interface EmpresasContextType {
    empresas: Empresa[];
    setEmpresas: React.Dispatch<React.SetStateAction<Empresa[]>>;
    loading: boolean;
    error: string | null;
    crearEmpresa: (empresa: Empresa) => Promise<boolean>;
}

const EmpresasContext = createContext<EmpresasContextType | undefined>(undefined);

export const EmpresasProvider = ({ children }: { children: React.ReactNode }) => {
    const [empresas, setEmpresas] = useState<Empresa[]>(() => {
        const stored = localStorage.getItem("empresas");
        return stored ? JSON.parse(stored) : [];
    });

    const [loading, setLoading] = useState(empresas.length === 0);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchEmpresas = async () => {
        try {
            const res = await fetch(`${API_URL}/empresas/`);
            if (!res.ok) throw new Error("Error al obtener empresas");
            const data: Empresa[] = await res.json();
            setEmpresas(data);
            localStorage.setItem("empresas", JSON.stringify(data));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const crearEmpresa = async (empresa: Empresa): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...empresa,
                    username: empresa.email,
                    password: "123456",
                    rol: "empresa",
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "No se pudo registrar la empresa");
            }

            await fetchEmpresas();
            return true;
        } catch (err) {
            console.error("Error creando empresa:", err);
            return false;
        }
    };

    useEffect(() => {
        if (empresas.length === 0) fetchEmpresas();
    }, []);

    return (
        <EmpresasContext.Provider
            value={{ empresas, setEmpresas, loading, error, crearEmpresa }}
        >
            {children}
        </EmpresasContext.Provider>
    );
};

export const useEmpresas = () => {
    const ctx = useContext(EmpresasContext);
    if (!ctx) throw new Error("useEmpresas debe usarse dentro de EmpresasProvider");
    return ctx;
};
