import * as z from "zod"

export const ofertaSchema = z.object({
    titulo: z.string().min(2),
    tipo: z.string().min(1),
    fechaCierre: z.string().min(1),
    area: z.string().min(1),
    modalidad: z.string().min(1),
    horario: z.string().min(1),
    vacantes: z.coerce.number().min(1),
    experiencia: z.string().min(1),
    locacion: z.string().min(1),
    salario: z.coerce.number().min(0),
    motivo: z.string().optional(),
    fechaInicio: z.string().min(1),
    tiempo: z.coerce.number().min(0),
    fechaPubli: z.string().min(1),
    estadoPubli: z.enum(["PUBLICADA", "NO_PUBLICADA"]).optional(),
    idEmpresa: z.coerce.number(),

    funciones: z.array(z.string()).optional(),
    requisitos: z.array(z.string()).optional(),
    beneficios: z.array(z.string()).optional(),

    estado: z.enum(["PENDIENTE", "ACTIVA", "CERRADA"]).optional(),
});


export type OfertaFormValues = z.infer<typeof ofertaSchema>
