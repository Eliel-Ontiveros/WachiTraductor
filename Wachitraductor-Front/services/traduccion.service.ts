import { TraduccionRequest, TraduccionResponse, EstadisticasTraduccion } from './traduccion.types';

// Configuración estática para evitar problemas de inicialización
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.69:3000';

class TraduccionService {
    private get baseUrl() {
        return `${BACKEND_URL}/traduccion`;
    } async traducir(request: TraduccionRequest): Promise<TraduccionResponse> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const data: TraduccionResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error en traducción:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error desconocido al traducir');
        }
    }

    async obtenerEstadisticas(): Promise<EstadisticasTraduccion> {
        try {
            const response = await fetch(`${BACKEND_URL}/traduccion/estadisticas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error de conexión' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const data: EstadisticasTraduccion = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error desconocido al obtener estadísticas');
        }
    }

    // Método de respaldo para traducción offline básica
    async traducirLocal(texto: string, direccion: 'español-triqui' | 'triqui-español'): Promise<TraduccionResponse> {
        // Simulación de traducción local básica
        const traducciones: { [key: string]: string } = {
            'agua': 'yaa',
            'uno': "'ro' yo'o",
            'dos': 'vij',
            'tres': "va'nuj",
            'yaa': 'agua',
            "'ro' yo'o": 'uno',
            'vij': 'dos',
            "va'nuj": 'tres',
        };

        const textoNormalizado = texto.toLowerCase().trim();
        const traduccion = traducciones[textoNormalizado];

        return {
            textoOriginal: texto,
            textoTraducido: traduccion || 'Traducción no disponible',
            direccion,
            confianza: traduccion ? 90 : 0,
            alternativas: [],
            notas: traduccion ? 'Traducción local básica' : 'No se encontró traducción local'
        };
    }
}

// Instancia única del servicio
export const traduccionService = new TraduccionService();