// src/components/shared/BackButton.tsx
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRoleFromToken } from "@/helpers/auth"

interface BackButtonProps {
    fallback?: string
    label?: string
}

export function BackButton({ fallback, label = "Volver" }: BackButtonProps) {
    const navigate = useNavigate()

    const handleClick = () => {
        if (fallback) {
            navigate(fallback)
            return
        }

        const role = getRoleFromToken()
        if (role === "admin") {
            navigate("/admin/dashboard")
        } else if (role === "empresa") {
            navigate("/empresa/dashboard")
        } else {
            navigate("/")
        }
    }

    return (
        <Button variant="outline" onClick={handleClick} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {label}
        </Button>
    )
}
