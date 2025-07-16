"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, CheckCircle2, LockKeyhole, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"
import LogoWithTheme from "@/components/logo-theme"

export default function RecuperarForm({ token }: { token: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.warning("Contraseñas no coinciden", {
        description: "Por favor asegúrese que ambas contraseñas sean iguales",
      })
      return
    }

    if (password.length < 6) {
      toast.warning("Contraseña muy corta", {
        description: "La contraseña debe tener al menos 6 caracteres",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recuperacion/cambiar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ token, nueva_contrasena: password }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      setIsSuccess(true)
      toast.success("Contraseña actualizada", {
        description: "Su contraseña ha sido cambiada exitosamente",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      })
    } catch (error) {
      console.error(error)
      toast.error("Error al cambiar contraseña", {
        description: "El token puede ser inválido o haber expirado. Por favor solicite un nuevo enlace.",
        icon: <LockKeyhole className="w-5 h-5 text-destructive" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-8">
        <LogoWithTheme />
        <ThemeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center bg-muted/40 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <LockKeyhole className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Restablecer Contraseña</CardTitle>
              <CardDescription>
                {!isSuccess
                  ? "Ingrese su nueva contraseña para continuar"
                  : "Contraseña actualizada exitosamente"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="password">Nueva Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Actualizando...</span>
                        </>
                      ) : (
                        <>
                          <LockKeyhole className="h-4 w-4" />
                          <span>Cambiar Contraseña</span>
                        </>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 text-center"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                        ¡Contraseña actualizada!
                      </h3>
                      <p className="text-muted-foreground">
                        Ahora puede iniciar sesión con su nueva contraseña
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-center">
              <Button
                asChild
                variant={isSuccess ? "default" : "link"}
                className={isSuccess ? "gap-2" : ""}
              >
                <Link href="/auth/login">
                  {isSuccess && <span>←</span>}
                  {isSuccess ? "Iniciar Sesión" : "Volver a Iniciar Sesión"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4"
      >
        <div className="container px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LinkJob. Todos los derechos reservados.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}
