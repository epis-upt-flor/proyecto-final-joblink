export interface Egresado {
    id?: number
    nombres: string
    apellidos: string
    tipoDoc: string
    numDoc: string
    email: string
    telefono: string
    direccion?: string
    nacionalidad?: string
    fechaNacimiento: string
    habilidades?: string
    logrosAcademicos?: string
    certificados?: string
    experienciaLaboral?: string
    idiomas?: string
    linkedin?: string
    github?: string
    cv?: string
    disponibilidad?: boolean
}
