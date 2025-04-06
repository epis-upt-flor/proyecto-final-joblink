export interface OfertaPayload {
    titulo: string;
    tipo: string;
    area: string;
    modalidad: string;
    horario: string;
    vacantes: number;
    experiencia: string;
    locacion: string;
    salario?: number;
    funciones: string;
    requisitos: string;
    beneficios?: string;
    fechaInicio: string;
    tiempo: number;
    idEmpresa: number;
}

export interface Oferta extends OfertaPayload {
    id?: number;
    estado?: string;
    fechaPubli?: string;
    fechaCierre?: string | null;
    estadoPubli?: string | null;
    motivo?: string | null;
    empresaNombre?: string;
}
