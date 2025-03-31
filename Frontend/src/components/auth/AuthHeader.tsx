import { GraduationCap } from "lucide-react"
import uptLogo from "@/assets/UPT.png"

export default function AuthHeader() {
  return (
    <div className="w-full p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-border">
      {/* LinkJob */}
      <div className="flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl text-foreground">LinkJob</span>
      </div>

      {/* UPT */}
      <div className="flex items-center gap-2">
      <img src={uptLogo} alt="UPT Logo" className="h-10 w-auto" />
        <span className="font-bold text-xl text-foreground whitespace-nowrap">
          Universidad Privada de Tacna
        </span>
      </div>
    </div>
  )
}
