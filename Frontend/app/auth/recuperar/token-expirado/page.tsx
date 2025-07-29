"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import LogoWithTheme from "@/components/logo-theme"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export default function TokenExpiradoPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen"
    >
      {/* Header */}
      <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <LogoWithTheme />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="outline" className="rounded-full">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-xl"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-destructive/10 rounded-full p-6">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-destructive mb-4">
            Enlace expirado
          </h1>
          <p className="text-muted-foreground mb-6">
            El enlace de recuperación que intentaste usar no es válido o ha caducado.  
            Por favor solicita uno nuevo para continuar con el restablecimiento de tu contraseña.
          </p>
          <Link href="/">
            <Button className="rounded-full px-6 gap-2">
              Volver al inicio
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8 mt-auto">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LinkJob. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/terminos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/contacto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contacto
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Preguntas Frecuentes
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}
