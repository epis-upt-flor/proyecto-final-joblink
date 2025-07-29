"use client"

import Link from "next/link"
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from 'react'
import { ArrowRight, Briefcase, Building2, Settings, BarChart2, CheckCircle, Users, FileText, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import LogoWithTheme from "@/components/logo-theme"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
    const { theme } = useTheme()

    const toggleTheme = () => {
        const current = localStorage.getItem("theme")
        const newTheme = current === "dark" ? "light" : "dark"
        localStorage.setItem("theme", newTheme)
        window.location.reload()
    }

    const logoSrc = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'
    
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
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

            {/* Hero Section */}
            <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/10 to-background">
                <div className="container px-4 md:px-6">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center justify-center space-y-4 text-center"
                    >
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                LinkJob
                            </h1>
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                                Sistema de Recomendación Laboral
                            </h2>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                                La plataforma inteligente que conecta empresas con el talento ideal mediante inteligencia artificial
                            </p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href="/auth/login">
                                <Button size="lg" className="rounded-full px-8">
                                    Acceder al Sistema
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 md:py-24 lg:py-32 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center justify-center space-y-4 text-center"
                    >
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestras Funcionalidades</h2>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                                Soluciones diseñadas para optimizar la contratación y gestión de talento
                            </p>
                        </div>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow border-primary/20">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-primary/10">
                                            <Building2 className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle>Para Empresas</CardTitle>
                                            <CardDescription>Encuentra el candidato perfecto</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Registro de ofertas laborales</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Panel de gestión de candidatos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Herramientas de seguimiento</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                        
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow border-primary/20">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-primary/10">
                                            <Settings className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle>Para Administradores</CardTitle>
                                            <CardDescription>Control total del sistema</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Recomendación de egresados con IA</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Gestión de cuentas empresariales</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Moderación de vacantes</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Reportes y estadísticas</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 md:py-16 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-background p-6 rounded-xl shadow-sm text-center border border-border/50"
                        >
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold text-primary">+50</h3>
                            <p className="text-muted-foreground">Empresas</p>
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-background p-6 rounded-xl shadow-sm text-center border border-border/50"
                        >
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold text-primary">+500</h3>
                            <p className="text-muted-foreground">Vacantes</p>
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-background p-6 rounded-xl shadow-sm text-center border border-border/50"
                        >
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <BarChart2 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold text-primary">+400</h3>
                            <p className="text-muted-foreground">Conexiones</p>
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-background p-6 rounded-xl shadow-sm text-center border border-border/50"
                        >
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Percent className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold text-primary">90%</h3>
                            <p className="text-muted-foreground">Tasa de éxito</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/20"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Listo para transformar tu proceso de contratación?</h2>
                        <p className="max-w-2xl mx-auto text-muted-foreground mb-6">
                            Descubre cómo LinkJob puede optimizar tu búsqueda de talento con nuestra tecnología de recomendación inteligente
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href="/auth/login">
                                <Button size="lg" className="rounded-full px-8">
                                    Comenzar Ahora
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">© 2025 LinkJob. Todos los derechos reservados.</p>
                        </div>
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