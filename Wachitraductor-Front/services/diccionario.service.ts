import {
    EntradaDiccionario,
    FiltrosDiccionario,
    RespuestaPaginadaDiccionario,
    RespuestaDiccionario,
    EstadisticasDiccionario,
    OpcionesFiltro,
    SugerenciasBusqueda,
    IdiomaBusqueda
} from './diccionario.types';
import { APP_CONFIG } from '../constants/config';

class DiccionarioService {
    private baseUrl = APP_CONFIG.BACKEND_URL; // URL del backend desde configuración

    /**
     * Obtiene entradas del diccionario con filtros opcionales
     */
    async obtenerEntradas(filtros?: FiltrosDiccionario): Promise<RespuestaPaginadaDiccionario> {
        try {
            const params = new URLSearchParams();

            if (filtros?.busqueda) {
                params.append('busqueda', filtros.busqueda);
            }
            if (filtros?.categoria) {
                params.append('categoria', filtros.categoria);
            }
            if (filtros?.areaTematica) {
                params.append('areaTematica', filtros.areaTematica);
            }
            if (filtros?.nivelDificultad) {
                params.append('nivelDificultad', filtros.nivelDificultad.toString());
            }
            if (filtros?.pagina) {
                params.append('pagina', filtros.pagina.toString());
            }
            if (filtros?.limite) {
                params.append('limite', filtros.limite.toString());
            }
            if (filtros?.idioma) {
                params.append('idioma', filtros.idioma);
            }
            if (filtros?.ordenarPor) {
                params.append('ordenarPor', filtros.ordenarPor);
            }
            if (filtros?.direccion) {
                params.append('direccion', filtros.direccion);
            }

            const url = `${this.baseUrl}/diccionario?${params.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: RespuestaPaginadaDiccionario = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener entradas del diccionario:', error);
            throw new Error('No se pudo obtener la información del diccionario');
        }
    }

    /**
     * Obtiene todas las entradas del diccionario sin paginación
     */
    async obtenerTodasLasEntradas(): Promise<EntradaDiccionario[]> {
        try {
            const url = `${this.baseUrl}/diccionario/todas`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: EntradaDiccionario[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener todas las entradas del diccionario:', error);
            throw new Error('No se pudo obtener todas las entradas del diccionario');
        }
    }

    /**
     * Obtiene una entrada específica del diccionario por ID
     */
    async obtenerEntradaPorId(id: number): Promise<EntradaDiccionario> {
        try {
            const url = `${this.baseUrl}/diccionario/${id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Entrada no encontrada');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: EntradaDiccionario = await response.json();
            return data;
        } catch (error) {
            console.error(`Error al obtener entrada con ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Busca una palabra específica en el diccionario
     */
    async buscarPorPalabra(palabra: string, idioma?: IdiomaBusqueda): Promise<EntradaDiccionario[]> {
        try {
            const params = new URLSearchParams();
            if (idioma && idioma !== 'ambos') {
                params.append('idioma', idioma);
            }

            const paramString = params.toString();
            const url = `${this.baseUrl}/diccionario/buscar/${encodeURIComponent(palabra)}${paramString ? '?' + paramString : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return []; // Palabra no encontrada, retornar array vacío
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: EntradaDiccionario[] = await response.json();
            return data;
        } catch (error) {
            console.error(`Error al buscar palabra "${palabra}":`, error);
            throw new Error('No se pudo realizar la búsqueda');
        }
    }

    /**
     * Obtiene sugerencias de palabras para autocompletar
     */
    async obtenerSugerencias(termino: string, limite: number = 5): Promise<SugerenciasBusqueda> {
        try {
            if (!termino || termino.trim().length < 2) {
                return [];
            }

            const params = new URLSearchParams();
            params.append('q', termino.trim());
            params.append('limite', limite.toString());

            const url = `${this.baseUrl}/diccionario/sugerencias?${params.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: SugerenciasBusqueda = await response.json();
            return data;
        } catch (error) {
            console.error(`Error al obtener sugerencias para "${termino}":`, error);
            return []; // Retornar array vacío en caso de error
        }
    }

    /**
     * Obtiene estadísticas del diccionario
     */
    async obtenerEstadisticas(): Promise<EstadisticasDiccionario> {
        try {
            const url = `${this.baseUrl}/diccionario/estadisticas`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: EstadisticasDiccionario = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener estadísticas del diccionario:', error);
            throw new Error('No se pudo obtener las estadísticas del diccionario');
        }
    }

    /**
     * Obtiene todas las categorías gramaticales disponibles
     */
    async obtenerCategorias(): Promise<string[]> {
        try {
            const url = `${this.baseUrl}/diccionario/categorias`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: string[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw new Error('No se pudo obtener las categorías');
        }
    }

    /**
     * Obtiene todas las áreas temáticas disponibles
     */
    async obtenerAreasTematicas(): Promise<string[]> {
        try {
            const url = `${this.baseUrl}/diccionario/areas-tematicas`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: string[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener áreas temáticas:', error);
            throw new Error('No se pudo obtener las áreas temáticas');
        }
    }

    /**
     * Obtiene todas las opciones de filtro disponibles
     */
    async obtenerOpcionesFiltro(): Promise<OpcionesFiltro> {
        try {
            const [categorias, areasTematicas] = await Promise.all([
                this.obtenerCategorias(),
                this.obtenerAreasTematicas()
            ]);

            return {
                categorias,
                areasTematicas,
                nivelesDificultad: [1, 2, 3]
            };
        } catch (error) {
            console.error('Error al obtener opciones de filtro:', error);
            throw new Error('No se pudo obtener las opciones de filtro');
        }
    }

    /**
     * Realiza una búsqueda simple con un término
     */
    async busquedaSimple(termino: string): Promise<EntradaDiccionario[]> {
        try {
            const filtros: FiltrosDiccionario = {
                busqueda: termino,
                limite: 50, // Más resultados para búsqueda simple
                idioma: 'ambos'
            };

            const respuesta = await this.obtenerEntradas(filtros);
            return respuesta.entradas;
        } catch (error) {
            console.error(`Error en búsqueda simple para "${termino}":`, error);
            throw new Error('No se pudo realizar la búsqueda');
        }
    }
}

// Exportar una instancia del servicio
export const diccionarioService = new DiccionarioService();
export default diccionarioService;