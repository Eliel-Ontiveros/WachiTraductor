// Enums que deben coincidir con el backend
export enum CategoriaGramatical {
    SUSTANTIVO = 'sustantivo',
    VERBO = 'verbo',
    ADJETIVO = 'adjetivo',
    NUMERAL = 'numeral'
}

// Nota: AreaTematica se define dinámicamente según el contenido del diccionario JSON
// Áreas actualmente en uso: 'numeros', 'parentesco', 'tiempo'

// Interfaz principal para una entrada del diccionario
export interface EntradaDiccionario {
    id: number;
    palabraEspanol: string;
    palabraTriqui: string;
    pronunciacion?: string;
    categoria: CategoriaGramatical;
    areaTematica: string; // Cambiado para usar string directo
    definicion: string;
    ejemploEspanol?: string;
    ejemploTriqui?: string;
    traduccionEjemplo?: string;
    palabrasRelacionadas?: string[];
    notas?: string;
    nivelDificultad: number;
    fechaCreacion: string;
    variantesDialectales?: string[];
}

// Interfaz para los filtros de búsqueda
export interface FiltrosDiccionario {
    busqueda?: string;
    categoria?: CategoriaGramatical;
    areaTematica?: string; // Cambiado para usar string directo en lugar del enum
    nivelDificultad?: number;
    pagina?: number;
    limite?: number;
    idioma?: 'español' | 'triqui' | 'ambos';
    ordenarPor?: 'palabra-espanol' | 'palabra-triqui' | 'categoria' | 'nivel' | 'fecha';
    direccion?: 'asc' | 'desc';
}

// Interfaz para la información de paginación
export interface PaginacionInfo {
    paginaActual: number;
    totalPaginas: number;
    totalElementos: number;
    elementosPorPagina: number;
    hayPaginaSiguiente: boolean;
    hayPaginaAnterior: boolean;
}

// Interfaz para la respuesta paginada del diccionario
export interface RespuestaPaginadaDiccionario {
    entradas: EntradaDiccionario[];
    paginacion: PaginacionInfo;
    filtrosAplicados: FiltrosDiccionario;
}

// Interfaz para la respuesta simple del diccionario
export interface RespuestaDiccionario {
    exito: boolean;
    mensaje: string;
    datos: EntradaDiccionario[];
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}

// Interfaz para estadísticas del diccionario
export interface EstadisticasDiccionario {
    totalEntradas: number;
    categorias: Record<string, number>;
    areasTematicas: Record<string, number>;
    nivelesDificultad: {
        basico: number;
        intermedio: number;
        avanzado: number;
    };
}

// Interfaz para las opciones de filtro disponibles
export interface OpcionesFiltro {
    categorias: string[];
    areasTematicas: string[];
    nivelesDificultad: number[];
}

// Tipo para las sugerencias de búsqueda
export type SugerenciasBusqueda = string[];

// Tipos de utilidad para mejor tipado
export type IdiomaBusqueda = 'español' | 'triqui' | 'ambos';
export type CriterioOrdenamiento = 'palabra-espanol' | 'palabra-triqui' | 'categoria' | 'nivel' | 'fecha';
export type DireccionOrdenamiento = 'asc' | 'desc';