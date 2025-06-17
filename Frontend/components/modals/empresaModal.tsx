"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { crearEmpresa } from "@/api/empresaApi"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const empresaSchema = z
    .object({
        username: z.string().min(3, { message: "El nombre de usuario es requerido (mínimo 3 caracteres)" }),
        email: z.string().email({ message: "Email inválido" }),
        password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
        confirmarPassword: z.string(),
        nombre: z.string().min(2, { message: "El nombre es requerido" }),
        ruc: z.string().length(11, { message: "El RUC debe tener 11 dígitos" }),
        telefono: z.string().min(1, { message: "El teléfono es requerido" }),
        logo: z.string().url({ message: "Debe ser una URL válida" }).optional(),
    })
    .refine((data) => data.password === data.confirmarPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmarPassword"],
    })

type EmpresaFormValues = z.infer<typeof empresaSchema>

interface AgregarEmpresaModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function AgregarEmpresaModal({ open, onOpenChange, onSuccess }: AgregarEmpresaModalProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("informacion")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [formDataToSubmit, setFormDataToSubmit] = useState<EmpresaFormValues | null>(null)

    const form = useForm<EmpresaFormValues>({
        resolver: zodResolver(empresaSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmarPassword: "",
            nombre: "",
            ruc: "",
            telefono: "",
            logo: "",
        },
    })
    const handleFormSubmit = async (data: EmpresaFormValues) => {
        setFormDataToSubmit(data)
        setShowConfirmDialog(true)
    }
    const confirmSubmit = async () => {
        if (!formDataToSubmit) return

        try {
            setIsSubmitting(true)

            const empresaData = {
                username: formDataToSubmit.username,
                email: formDataToSubmit.email,
                password: formDataToSubmit.password,
                idRol: 2,
                nombre: formDataToSubmit.nombre,
                ruc: formDataToSubmit.ruc,
                telefono: formDataToSubmit.telefono,
                logo: formDataToSubmit.logo,
                estado: true,
            }

            await crearEmpresa(empresaData)

            toast({
                title: "Empresa agregada",
                description: "La empresa ha sido creada exitosamente",
            })

            form.reset()
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            console.error("Error al crear empresa:", error)
            toast({
                title: "Error",
                description: "Ocurrió un error al agregar la empresa",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
            setShowConfirmDialog(false)
            setFormDataToSubmit(null)
        }
    }

    const onSubmit = async (data: EmpresaFormValues) => {
        try {
            setIsSubmitting(true)

            const empresaData = {
                username: data.username,
                email: data.email,
                password: data.password,
                idRol: 2,
                nombre: data.nombre,
                ruc: data.ruc,
                telefono: data.telefono,
                logo: data.logo,
                estado: true,
            }


            await crearEmpresa(empresaData)

            toast({
                title: "Empresa agregada",
                description: "La empresa ha sido creada exitosamente",
            })

            form.reset()
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            console.error("Error al crear empresa:", error)
            toast({
                title: "Error",
                description: "Ocurrió un error al agregar la empresa",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Nueva Empresa</DialogTitle>
                    <DialogDescription>
                        Complete el formulario para registrar una nueva empresa en el sistema.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="informacion">Información</TabsTrigger>
                                <TabsTrigger value="credenciales">Credenciales</TabsTrigger>
                            </TabsList>

                            <TabsContent value="informacion" className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre de la Empresa</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre de la empresa" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="ruc"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>RUC</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="RUC" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="telefono"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Teléfono" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="logo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL del Logo (opcional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://cdn.miempresa.com/logo.png" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            {field.value && (
                                                <div className="mt-2 w-32 h-32 mx-auto">
                                                    <img
                                                        src={field.value}
                                                        alt="Vista previa del logo"
                                                        className="w-full h-full object-contain border rounded-md"
                                                    />
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end">
                                    <Button type="button" onClick={() => setActiveTab("credenciales")}>
                                        Siguiente
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="credenciales" className="space-y-4 mt-4">
                                <div className="space-y-2 mb-4">
                                    <h3 className="text-lg font-medium">Credenciales de Acceso</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Cree las credenciales para que la empresa pueda acceder al sistema.
                                    </p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre de Usuario</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre de usuario" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="correo@empresa.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contraseña</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                                                </FormControl>
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmarPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirmar Contraseña</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab("informacion")}>
                                        Anterior
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Guardar Empresa
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Confirmar registro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Estás a punto de registrar una nueva empresa en el sistema. ¿Deseas continuar?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmSubmit}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirmar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </DialogContent>
        </Dialog>
    )
}
