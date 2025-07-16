"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Mail, ShieldAlert, Info, CheckCircle2 } from 'lucide-react'
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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isSubmitted && isOpen) {
      // Smooth scroll al final del diálogo cuando se envía el formulario
      setTimeout(() => {
        const dialogContent = document.querySelector('.dialog-content-end')
        dialogContent?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }, 100)
    }
  }, [isSubmitted, isOpen])

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

      // Iniciar transición
      setIsTransitioning(true)
      setTimeout(() => {
        setIsSubmitted(true)
        setIsTransitioning(false)
        toast.success("Solicitud enviada", {
          description: "Se ha enviado un enlace de recuperación a su correo electrónico",
        })
      }, 300) // Duración de la animación de salida
    } catch (error) {
      toast.error("Error en la solicitud", {
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
      <DialogContent className="sm:max-w-[450px] rounded-lg">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-3">
            {!isSubmitted ? (
              <div className={`p-3 rounded-full bg-blue-100 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <Info className="h-8 w-8 text-blue-500" />
              </div>
            ) : (
              <div className={`p-3 rounded-full bg-emerald-500/10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
            )}
            <DialogTitle className={`text-2xl transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {!isSubmitted ? "Recuperar Contraseña" : "¡Enlace Enviado!"}
            </DialogTitle>
            <DialogDescription className={`text-base transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {!isSubmitted 
                ? "Ingrese su correo empresarial para recibir instrucciones de recuperación"
                : "Revise su bandeja de entrada para continuar el proceso"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="relative min-h-[200px]">
          {/* Formulario */}
          <div 
            ref={formRef}
            className={`transition-all duration-300 ${isSubmitted ? 'absolute inset-0 opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Correo Electrónico Empresarial</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11 text-base"
                />
                <p className="text-sm text-muted-foreground">
                  Le enviaremos un enlace seguro para restablecer su contraseña.
                </p>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose} 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !email}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar Instrucciones
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>

          {/* Mensaje de éxito */}
          <div 
            ref={successRef}
            className={`transition-all duration-300 ${!isSubmitted ? 'absolute inset-0 opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="space-y-6">
              <div className="bg-secondary/50 p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">
                      Correo enviado a: <span className="text-primary">{email}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      El enlace de recuperación es válido por 10 minutos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-300" />
                  <div>
                    <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200">
                      ¿No recibiste el correo?
                    </h4>
                    <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                      <li>Revisa tu carpeta de spam o correo no deseado</li>
                      <li>Verifica que ingresaste correctamente tu correo</li>
                      <li>Intenta nuevamente en unos minutos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  onClick={handleClose}
                  className="w-full dialog-content-end"
                >
                  Entendido
                </Button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}