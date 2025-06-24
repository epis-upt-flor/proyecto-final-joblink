export interface TasaExitoItem {
  egresado_id: number
  nombres: string
  apellidos: string
  postulaciones: number
  contratos: number
  tasa_exito: number
}

export interface EmpresaContratacion {
  empresa_id: number
  nombre: string
  total_contratos: number
  promedio_dias: number
  reincidencia: boolean
}

export interface ContratacionAreaItem {
  area: string
  total_contratos: number
}

export interface PerfilEgresadoContratado {
  habilidades_top: [string, number][]
  idiomas_top: [string, number][]
}

export interface RankingEgresadoItem {
  egresado_id: number
  nombres: string
  apellidos: string
  ranking_promedio: number
  total_contratos: number
}
