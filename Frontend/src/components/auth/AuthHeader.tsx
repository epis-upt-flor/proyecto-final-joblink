import { GraduationCap } from "lucide-react";

export default function AuthHeader() {
  return (
    <div className="w-full p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-border">
      {/* Logo + Nombre */}
      <div className="flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl text-foreground">LinkJob</span>
      </div>

      {/* Universidad */}
      <div className="font-bold text-xl text-foreground">
        Universidad Privada de Tacna
      </div>
    </div>
  );
}
