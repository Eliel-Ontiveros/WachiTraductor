import { useState, useCallback } from 'react';
import { traduccionService } from '../services/traduccion.service';
import { TraduccionRequest, TraduccionResponse } from '../services/traduccion.types';

export const useTranslation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const traducir = useCallback(async (
    texto: string,
    direccion: 'español-triqui' | 'triqui-español'
  ): Promise<TraduccionResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const request: TraduccionRequest = {
        texto,
        direccion,
      };

      const resultado = await traduccionService.traducir(request);
      return resultado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al traducir';
      setError(errorMessage);
      console.error('Error en traducción:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const traducirBatch = useCallback(async (
    textos: string[],
    direccion: 'español-triqui' | 'triqui-español'
  ): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const resultados = await traduccionService.traducirBatch(textos, direccion);
      return resultados;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en traducción batch';
      setError(errorMessage);
      console.error('Error en traducción batch:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const verificarServicio = useCallback(async (): Promise<boolean> => {
    try {
      return await traduccionService.verificarSalud();
    } catch (err) {
      console.error('Error al verificar servicio:', err);
      return false;
    }
  }, []);

  return {
    traducir,
    traducirBatch,
    verificarServicio,
    loading,
    error,
  };
};
