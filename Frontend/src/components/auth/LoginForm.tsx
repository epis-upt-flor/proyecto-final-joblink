import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

interface LoginFormProps {
  role: "admin" | "empresa";
}

export default function LoginForm({ role }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });


      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error al iniciar sesión.");
      }

      const data = await res.json();
      const tokenPayload = JSON.parse(atob(data.access_token.split(".")[1]));
      if (tokenPayload.role !== role) {
        toast.error(`El usuario no pertenece al rol: ${role}`);
        return;
      }

      localStorage.setItem("token", data.access_token);
      toast.success("Sesión iniciada correctamente");

      if (tokenPayload.role === "admin") {
        navigate("/admin/dashboard");
      } else if (tokenPayload.role === "empresa") {
        navigate("/empresa/dashboard");
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Ocurrió un error.");
      } else {
        toast.error("Ocurrió un error.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`${role}-username`}>Usuario</Label>
        <Input
          id={`${role}-username`}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${role}-password`}>Contraseña</Label>
        <Input
          id={`${role}-password`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id={`${role}-remember`} />
          <label
            htmlFor={`${role}-remember`}
            className="text-sm text-muted-foreground"
          >
            Recordarme
          </label>
        </div>

        <ForgotPasswordDialog />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 010-16z"
              ></path>
            </svg>
            Cargando...
          </div>
        ) : (
          "Iniciar sesión"
        )}
      </Button>

    </form>
  );
}
