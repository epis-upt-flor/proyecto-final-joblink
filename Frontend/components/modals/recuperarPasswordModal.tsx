"use client"

import { useState } from "react"
import { Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
interface RecuperarPasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

export function RecuperarPasswordModal({ isOpen, onClose }: RecuperarPasswordModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recuperacion/solicitar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            if (!response.ok) {
                throw new Error('Error al solicitar recuperación')
            }

            setIsSubmitted(true)
            toast(
                "Solicitud enviada", {
                description: "Se ha enviado un enlace de recuperación a su correo electrónico",
            })
        } catch (error) {
            toast(
                "Error", {
                description: "No se pudo procesar su solicitud. Verifique su correo e intente nuevamente.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setEmail("")
        setIsSubmitted(false)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Recuperar Contraseña</DialogTitle>
                    <DialogDescription>
                        Ingrese su correo electrónico para recibir un enlace de recuperación
                    </DialogDescription>
                </DialogHeader>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enviar Enlace
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor, revise su bandeja de
                            entrada y siga las instrucciones para restablecer su contraseña.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Si no recibe el correo en unos minutos, revise su carpeta de spam o intente nuevamente.
                        </p>
                        <DialogFooter>
                            <Button onClick={handleClose}>Cerrar</Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
