import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { OfertasProvider } from "@/context/OfertasContext";

import LoginPage from "@/pages/Login";
import EmpresaDashboard from "./pages/empresa/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import OfertaDetalle from "@/pages/OfertaDetalle";
import EgresadoDetalle from "@/pages/EgresadoDetalle";
import { EmpresasProvider } from "@/context/EmpresaContext";
import EmpresaDetalle from "@/pages/EmpresaDetalle";
import RecuperarContrasena from "@/pages/Recuperar";
import { EgresadoProvider } from "@/context/EgresadoContext";

function App() {
  return (
    <DarkModeProvider>
      <EmpresasProvider>
        <EgresadoProvider>
          <OfertasProvider>
            <Router>
              <div>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
                  <Route path="/oferta/:id" element={<OfertaDetalle />} />
                  <Route path="/egresado/:id" element={<EgresadoDetalle />} />
                  <Route path="/empresa/:id" element={<EmpresaDetalle />} />
                  <Route path="/recuperar" element={<RecuperarContrasena />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </OfertasProvider>
        </EgresadoProvider>
      </EmpresasProvider>
    </DarkModeProvider>
  );
}

export default App;
