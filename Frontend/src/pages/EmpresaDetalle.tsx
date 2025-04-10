import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Empresa } from "@/types/Empresa"
import { toast } from "sonner"
import { BackButton } from "@/components/shared/BackButton"

import {
    Building2,
    Mail,
    Phone,
    User,
    Hash,
    CheckCircle,
    XCircle,
} from "lucide-react"

export default function EmpresaDetalle() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [empresa, setEmpresa] = useState<Empresa | null>(null)

    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                const local = localStorage.getItem("empresas")
                const lista = local ? (JSON.parse(local) as Empresa[]) : []
                const encontrada = lista.find((e) => e.id === Number(id))

                if (encontrada) {
                    setEmpresa(encontrada)
                } else {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/empresas/`)
                    if (!res.ok) throw new Error("No se pudo obtener la empresa")

                    const data: Empresa[] = await res.json()
                    const match = data.find((e) => e.id === Number(id))
                    if (!match) throw new Error("Empresa no encontrada")

                    setEmpresa(match)
                    localStorage.setItem("empresas", JSON.stringify(data))
                }
            } catch (err) {
                toast.error("Empresa no encontrada")
                navigate("/")
            }
        }

        if (id) fetchEmpresa()
    }, [id, navigate])

    if (!empresa) return <p className="text-center">Cargando empresa...</p>

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
                            <Badge>
                                {empresa.estado ? "Activo" : "Inactivo"}
                            </Badge>
                        </CardHeader>
                        <CardContent className="flex flex-col space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                Empresa
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {empresa.username}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {empresa.email}
                            </div>
                        </CardContent>
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
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Nombre
                                </h3>
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
                        <BackButton fallback="/admin/dashboard?tab=empresas" />
                    </div>

                </div>
            </div>
        </div>
    )
}
