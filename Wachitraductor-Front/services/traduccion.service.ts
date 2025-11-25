import { TraduccionRequest, TraduccionResponse } from './traduccion.types';

const TRANSLATE_API_URL = 'https://wachitraductor-v2-production.up.railway.app';

export const traduccionService = {
  async traducir(request: TraduccionRequest): Promise<TraduccionResponse> {
    try {
      const response = await fetch(`${TRANSLATE_API_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: request.texto 
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la traducción: ${response.status}`);
      }

      const data = await response.json();
      
      // Mapear la respuesta del API al formato esperado
      return {
        textoOriginal: request.texto,
        textoTraducido: data.translated_text,
        direccion: request.direccion,
        confianza: data.confidence || 0.95, // Valor por defecto si no viene
        alternativas: data.alternatives || [],
        notas: data.notes,
      };
    } catch (error) {
      console.error('Error al traducir:', error);
      throw error;
    }
  },

  async traducirBatch(textos: string[], direccion: 'español-triqui' | 'triqui-español'): Promise<string[]> {
    try {
      const response = await fetch(`${TRANSLATE_API_URL}/translate/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          texts: textos 
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la traducción batch: ${response.status}`);
      }

      const data = await response.json();
      return data.translated_texts || [];
    } catch (error) {
      console.error('Error al traducir batch:', error);
      throw error;
    }
  },

  async verificarSalud(): Promise<boolean> {
    try {
      const response = await fetch(`${TRANSLATE_API_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar salud del servicio:', error);
      return false;
    }
  },

  obtenerDocumentacion(): string {
    return `${TRANSLATE_API_URL}/docs`;
  },
};