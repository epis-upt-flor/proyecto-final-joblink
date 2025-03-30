export interface Postulacion {
    id?: number;
    egresado_id: number;
    oferta_id: number;
    estado: "pendiente" | "aceptada" | "rechazada";
}
