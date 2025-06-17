"use client"

import { jwtDecode } from "jwt-decode"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { RecuperarPasswordModal } from "@/components/modals/recuperarPasswordModal"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isRecuperarModalOpen, setIsRecuperarModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error("Login failed")

            const data = await response.json()
            localStorage.setItem("token", data.access_token)

            const decoded: { sub: string; role: string } = jwtDecode(data.access_token)

            toast({
                title: "Inicio de sesión exitoso",
                description: "Redirigiendo al panel...",
            })

            const role = parseInt(decoded.role)

            if (role === 1) {
                router.push("/admin")
            } else if (role === 2) {
                router.push("/empresa")
            } else {
                router.push("/desconocido")
            }

        } catch (error) {
            toast({
                title: "Error al iniciar sesión",
                description: "Credenciales incorrectas. Inténtelo nuevamente.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
                    <CardDescription className="text-center">
                        Ingrese sus credenciales para acceder al sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="ejemplo.admin"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-sm text-primary"
                                    onClick={() => setIsRecuperarModalOpen(true)}
                                >
                                    ¿Olvidó su contraseña?
                                </Button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                                </Button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Iniciar Sesión
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Si no tiene credenciales de acceso, contacte al administrador del sistema.
                        </p>
                    </div>
                    <div className="text-center">
                        <Link href="/" className="text-sm text-muted-foreground hover:underline">
                            Volver a la página principal
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            <RecuperarPasswordModal
                isOpen={isRecuperarModalOpen}
                onClose={() => setIsRecuperarModalOpen(false)}
            />
        </div>
    )
}
