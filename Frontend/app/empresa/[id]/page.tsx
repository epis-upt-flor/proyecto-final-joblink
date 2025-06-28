'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Empresa } from "@/types/Empresa"
import { Button } from "@/components/ui/button"
import {
    Building2, Mail, Phone, User, Hash,
    CheckCircle, XCircle, ArrowLeft
} from "lucide-react"
import { fetchEmpresa } from "@/api/empresaApi"

export default function EmpresaDetallePage() {
    const params = useParams()
    const router = useRouter()
    const [empresa, setEmpresa] = useState<Empresa | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getEmpresa = async () => {
            try {
                const id = Number(params.id)

                const data = await fetchEmpresa(id)

                setEmpresa(data)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Empresa no encontrada",
                    variant: "destructive",
                })
                router.push("/admin")
            } finally {
                setLoading(false)
            }
        }


        getEmpresa()
    }, [params.id, router])

    if (loading) return <p className="text-center py-10">Cargando empresa...</p>
    if (!empresa) return null

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* PANEL IZQUIERDO */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="flex flex-col items-center text-center space-y-2">
                            <div className="relative h-32 w-32 overflow-hidden rounded-full border">
                                <img
                                    src={empresa.logo || "/placeholder.svg"}
                                    alt={empresa.nombre}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <CardTitle className="mt-2">{empresa.nombre}</CardTitle>
                            <Badge>{empresa.estado ? "Activo" : "Inactivo"}</Badge>
                        </CardHeader>
                   
                    </Card>
                </div>

                {/* PANEL DERECHO */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Empresa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                                <p className="text-lg font-semibold">{empresa.nombre}</p>
                            </div>

                            <Separator />

                            <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                <p className="text-lg font-semibold">{empresa.ruc}</p>
                            </div>

                            <Separator />

                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <p className="text-lg font-semibold">{empresa.telefono}</p>
                            </div>

                            <Separator />

                            <div className="flex items-center gap-2">
                                {empresa.estado ? (
                                    <>
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <p className="text-lg font-semibold">Activo</p>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        <p className="text-lg font-semibold">Inactivo</p>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-4">
                        <Button variant="outline" onClick={() => router.push("/admin")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
