import { useState, useEffect } from "react";
import { Oferta } from "@/types/Oferta";
import { Empresa } from "@/types/Empresa";
import OfertaModal from "./OfertaModal";
import PlazasTable from "./PlazasTable";

export default function PlazasTab({ isAdmin }: { isAdmin: boolean }) {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);

    useEffect(() => {
        const fetchOfertas = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const res = await fetch(`${API_URL}/ofertas/`);

                if (!res.ok) throw new Error("Error al obtener las ofertas");
                const data = await res.json();
                setOfertas(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchOfertas();
    }, []);

    const handleSaveOferta = (oferta: Oferta) => {
        if (oferta.id) {
            setOfertas(ofertas.map((o) => (o.id === oferta.id ? oferta : o)));
        } else {
            const nueva = { ...oferta, id: ofertas.length + 1 };
            setOfertas([...ofertas, nueva]);
        }
        setSelectedOferta(null);
    };

    const handleSaveEmpresa = (empresa: Empresa) => {
        const nueva = { ...empresa, id: empresas.length + 1 };
        setEmpresas([...empresas, nueva]);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Plazas de Trabajo Disponibles</h2>
                <OfertaModal
                    onSave={handleSaveOferta}
                    empresas={empresas}
                    onSaveEmpresa={handleSaveEmpresa}
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
                    onSaveEmpresa={handleSaveEmpresa}
                />
            )}
        </div>
    );
}
