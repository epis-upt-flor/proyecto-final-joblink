import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordDialog() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    if (!email) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    toast.success("Revisa tu correo para restablecer tu contraseña.");
    setOpen(false);
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-sm text-muted-foreground hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Recuperar contraseña</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleSend}>
            Enviar enlace de recuperación
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
