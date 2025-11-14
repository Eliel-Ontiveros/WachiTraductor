export interface TraduccionRequest {
    texto: string;
    direccion: 'español-triqui' | 'triqui-español';
}

export interface TraduccionResponse {
    textoOriginal: string;
    textoTraducido: string;
    direccion: 'español-triqui' | 'triqui-español';
    confianza: number;
    alternativas: string[];
    notas?: string;
}

export interface EstadisticasTraduccion {
    totalPalabras: number;
    areasTemáticas: string[];
    categorías: string[];
    ultimaActualización: string;
}