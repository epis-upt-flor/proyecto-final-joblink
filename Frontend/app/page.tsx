"use client"
import Link from "next/link"
import { ArrowRight, Briefcase, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">LinkJob</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/auth/login">
                        <Button>Iniciar Sesión</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-12 md:py-24 lg:py-32 bg-muted/40">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Sistema de Recomendación para Egresados
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                Conectando el talento de los egresados con las mejores oportunidades laborales
                            </p>
                        </div>
                        <div>
                            <Link href="/auth/login">
                                <Button size="lg">
                                    Acceder al Sistema
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Características</h2>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                Nuestro sistema ofrece herramientas avanzadas para conectar egresados con empresas
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        <Card>
                            <CardHeader>
                                <Building2 className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Para Empresas</CardTitle>
                                <CardDescription>Encuentra el talento ideal para tus vacantes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>Publica plazas de trabajo</li>
                                    <li>Visualiza egresados postulados a tus ofertas</li>
                                    <li>Gestiona tus publicaciones</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Briefcase className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Para Administradores</CardTitle>
                                <CardDescription>Gestiona el sistema de recomendación</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>Aprueba plazas de trabajo</li>
                                    <li>Gestiona perfiles de egresados</li>
                                    <li>Administra cuentas de empresas</li>
                                    <li>Genera reportes y estadísticas</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-6 md:py-8 mt-auto">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-muted-foreground">© 2025 LinkJob. Todos los derechos reservados.</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/terminos" className="text-sm text-muted-foreground hover:underline">
                                Términos y Condiciones
                            </Link>
                            <Link href="/privacidad" className="text-sm text-muted-foreground hover:underline">
                                Política de Privacidad
                            </Link>
                            <Link href="/contacto" className="text-sm text-muted-foreground hover:underline">
                                Contacto
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
