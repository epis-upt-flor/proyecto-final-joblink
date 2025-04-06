"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

export default function RecuperarContrasena() {
    const [nueva, setNueva] = useState("")
    const [confirmar, setConfirmar] = useState("")
    const [token, setToken] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const tokenUrl = new URLSearchParams(window.location.search).get("token")
        if (!tokenUrl) {
            toast.error("Token inválido o faltante")
            navigate("/")
        } else {
            setToken(tokenUrl)
        }
    }, [])

    const handleCambiar = async () => {
        if (!nueva || !confirmar) {
            toast.error("Completa ambos campos")
            return
        }

        if (nueva !== confirmar) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/recuperacion/cambiar/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, nueva_contrasena: nueva }),
            })

            if (!res.ok) throw new Error("Token inválido o expirado")

            toast.success("Contraseña actualizada correctamente")
            navigate("/")
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold text-center">Restablecer Contraseña</h1>
            <div className="space-y-2">
                <Label>Nueva Contraseña</Label>
                <Input type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>Confirmar Contraseña</Label>
                <Input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
            </div>
            <Button className="w-full mt-4" onClick={handleCambiar}>
                Cambiar Contraseña
            </Button>
        </div>
    )
}
