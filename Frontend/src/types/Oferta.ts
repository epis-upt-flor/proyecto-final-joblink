export interface Oferta {
    id?: number;
    titulo: string;
    tipo: string;
    funciones: string;
    requisitos: string;
    beneficios?: string;
    area: string;
    modalidad: string;
    carga_horaria: string;
    vacantes: number;
    experiencia: string;
    ubigeo: string;
    salario?: string;
    empresa_id: number;
    empresa_nombre?: string;
    cerrada: boolean;
}
