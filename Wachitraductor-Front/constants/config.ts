// Configuración de la aplicación
export const APP_CONFIG = {
    // URL del backend - obtenida desde variables de entorno
    BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.69:3000',

    // Timeouts
    REQUEST_TIMEOUT: parseInt(process.env.EXPO_PUBLIC_REQUEST_TIMEOUT || '10000'),

    // Configuraciones de la aplicación
    APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'Wachitraductor',
    VERSION: process.env.EXPO_PUBLIC_VERSION || '1.0.0',
};

// URLs específicas de la API
export const API_ENDPOINTS = {
    CULTURA: {
        BASE: '/cultura',
        TIPOS: '/cultura/tipos',
        TODO: '/cultura/todo',
        POR_ID: (id: number) => `/cultura/${id}`,
    },
    DICCIONARIO: {
        BASE: '/diccionario',
        TODAS: '/diccionario/todas',
        ESTADISTICAS: '/diccionario/estadisticas',
        CATEGORIAS: '/diccionario/categorias',
        AREAS_TEMATICAS: '/diccionario/areas-tematicas',
        SUGERENCIAS: '/diccionario/sugerencias',
        BUSCAR: (palabra: string) => `/diccionario/buscar/${palabra}`,
        POR_ID: (id: number) => `/diccionario/${id}`,
    },
};

// Configuración de red para desarrollo con Expo
export const NETWORK_CONFIG = {
    // Para desarrollo local con dispositivo físico, 
    // cambiar por la IP de tu computadora
    LOCAL_IP: 'localhost', // Ejemplo: '192.168.1.100'
    PORT: 3000,
};

export default APP_CONFIG;