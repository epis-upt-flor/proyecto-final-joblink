import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

interface LoginFormProps {
  role: "admin" | "empresa";
}

export default function LoginForm({ role }: LoginFormProps) {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <label htmlFor={`${role}-username`} className="block text-sm font-medium text-foreground">
          Usuario
        </label>
        <Input id={`${role}-username`} type="text" placeholder="correo@gmail.com" />
      </div>

      <div className="space-y-2">
        <label htmlFor={`${role}-password`} className="block text-sm font-medium text-foreground">
          Contraseña
        </label>
        <Input id={`${role}-password`} type="password" placeholder="••••••••" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id={`${role}-remember`} />
          <label htmlFor={`${role}-remember`} className="text-sm text-muted-foreground">
            Recordarme
          </label>
        </div>
        
        {/*llamado a componente ForgotPasswortdDialos */}
        <ForgotPasswordDialog />

      </div>

      <Button type="submit" className="w-full">
        Iniciar sesión
      </Button>
    </form>
  );
}
