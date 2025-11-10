import {
    InformacionCultural,
    FiltrosCultura,
    RespuestaCultura,
    RespuestaTipos,
    RespuestaIndividual,
    RespuestaConfiguracionTipos,
    ConfiguracionTipo
} from './cultura.types';
import { APP_CONFIG } from '../constants/config';

class CulturaService {
    private baseUrl = APP_CONFIG.BACKEND_URL; // URL del backend desde configuración

    /**
     * Obtiene información cultural con filtros opcionales
     */
    async obtenerInformacionCultural(filtros?: FiltrosCultura): Promise<RespuestaCultura> {
        try {
            const params = new URLSearchParams();

            if (filtros?.busqueda) {
                params.append('busqueda', filtros.busqueda);
            }
            if (filtros?.tipo) {
                params.append('tipo', filtros.tipo);
            }
            if (filtros?.pagina) {
                params.append('pagina', filtros.pagina.toString());
            }
            if (filtros?.limite) {
                params.append('limite', filtros.limite.toString());
            }

            const url = `${this.baseUrl}/cultura${params.toString() ? '?' + params.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener información cultural:', error);
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        }
    }

    /**
     * Obtiene toda la información cultural sin filtros
     */
    async obtenerTodaLaInformacion(): Promise<{
        exito: boolean;
        mensaje: string;
        datos: InformacionCultural[];
        total: number;
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/cultura/todo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener toda la información:', error);
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        }
    }

    /**
     * Obtiene los tipos de información disponibles
     */
    async obtenerTipos(): Promise<RespuestaTipos> {
        try {
            const response = await fetch(`${this.baseUrl}/cultura/tipos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener tipos:', error);
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        }
    }

    /**
     * Obtiene la configuración completa de tipos con nombres y colores
     */
    async obtenerConfiguracionTipos(): Promise<RespuestaConfiguracionTipos> {
        try {
            const response = await fetch(`${this.baseUrl}/cultura/tipos/configuracion`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener configuración de tipos:', error);
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        }
    }

    /**
     * Obtiene información cultural específica por ID
     */
    async obtenerPorId(id: number): Promise<RespuestaIndividual> {
        try {
            const response = await fetch(`${this.baseUrl}/cultura/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener información por ID:', error);
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        }
    }

    /**
     * Verifica si el backend está disponible
     */
    async verificarConexion(): Promise<boolean> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.REQUEST_TIMEOUT);

            const response = await fetch(`${this.baseUrl}/cultura/tipos`, {
                method: 'GET',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            console.error('Backend no disponible:', error);
            return false;
        }
    }
}

// Exportar una instancia singleton
export const culturaService = new CulturaService();
export default CulturaService;