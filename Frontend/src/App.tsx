import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { DarkModeProvider } from "@/context/DarkModeContext";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import OfertaDetalle from "@/pages/OfertaDetalle";
import EgresadoDetalle from "@/pages/EgresadoDetalle";

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/oferta/:id" element={<OfertaDetalle />} />
            <Route path="/egresado/:id" element={<EgresadoDetalle />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
