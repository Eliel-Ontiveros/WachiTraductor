export interface InformacionCultural {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    imagen?: string;
    palabrasClave: string[];
    region: string;
    fechaCreacion: string;
}

export interface FiltrosCultura {
    busqueda?: string;
    tipo?: string;
    pagina?: number;
    limite?: number;
}

export interface RespuestaCultura {
    exito: boolean;
    mensaje: string;
    datos: InformacionCultural[];
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}

export interface RespuestaTipos {
    exito: boolean;
    mensaje: string;
    datos: string[];
}

export interface ConfiguracionTipo {
    nombre: string;
    color: string;
}

export interface RespuestaConfiguracionTipos {
    exito: boolean;
    mensaje: string;
    datos: { [key: string]: ConfiguracionTipo };
}

export interface RespuestaIndividual {
    exito: boolean;
    mensaje: string;
    datos: InformacionCultural;
}

export const TIPOS_CULTURA = {
    HISTORIA: 'historia',
    TRADICIONES: 'tradiciones',
    FESTIVALES: 'festivales',
    ARTESANIAS: 'artesanias',
    GASTRONOMIA: 'gastronomia',
    VESTIMENTA: 'vestimenta',
    MUSICA: 'musica',
    UBICACION: 'ubicacion',
    POBLACION: 'poblacion',
    IDIOMA: 'idioma',
} as const;