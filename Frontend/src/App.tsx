import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { OfertasProvider } from "@/context/OfertasContext";

import LoginPage from "@/pages/Login";
import EmpresaDashboard from "./pages/empresa/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import OfertaDetalle from "@/pages/OfertaDetalle";
import EgresadoDetalle from "@/pages/EgresadoDetalle";

function App() {
  return (
    <DarkModeProvider>
      <OfertasProvider>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
              <Route path="/oferta/:id" element={<OfertaDetalle />} />
              <Route path="/egresado/:id" element={<EgresadoDetalle />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </OfertasProvider>
    </DarkModeProvider>
  );
}

export default App;
