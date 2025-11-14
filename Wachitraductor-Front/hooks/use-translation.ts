import { useState } from 'react';
import { Alert } from 'react-native';
import { traduccionService } from '@/services/traduccion.service';
import { TraduccionRequest } from '@/services/traduccion.types';

export function useTranslation() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'left' | 'right'>('left');

  const translate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Sin texto', 'Escribe algo para traducir');
      return;
    }

    setIsTranslating(true);
    setOutputText('Traduciendo...');

    try {
      // Determinar la dirección de traducción basada en el idioma seleccionado
      const direccion = selectedLanguage === 'left' ? 'español-triqui' : 'triqui-español';

      const request: TraduccionRequest = {
        texto: inputText.trim(),
        direccion
      };

      const service = traduccionService;
      const resultado = await service.traducir(request);

      let textoCompleto = resultado.textoTraducido;

      // Agregar alternativas si existen
      if (resultado.alternativas && resultado.alternativas.length > 0) {
        textoCompleto += `\n\nAlternativas: ${resultado.alternativas.join(', ')}`;
      }

      // Agregar nota de confianza
      if (resultado.confianza < 100) {
        textoCompleto += `\n\n(Confianza: ${resultado.confianza}%)`;
      }

      setOutputText(textoCompleto);
    } catch (error) {
      console.error('Error en traducción:', error);

      // Intentar traducción local como respaldo
      try {
        const direccion = selectedLanguage === 'left' ? 'español-triqui' : 'triqui-español';
        const service = traduccionService;
        const resultadoLocal = await service.traducirLocal(inputText.trim(), direccion);
        setOutputText(`${resultadoLocal.textoTraducido}\n\n(Traducción offline - ${resultadoLocal.notas})`);
      } catch (localError) {
        setOutputText('Error: No se pudo traducir el texto');
        Alert.alert(
          'Error de traducción',
          error instanceof Error ? error.message : 'Error desconocido al traducir'
        );
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const clearTexts = () => {
    setInputText('');
    setOutputText('');
  };

  const clearInputText = () => {
    setInputText('');
    setOutputText(''); // También limpiamos la traducción cuando se limpia el input
  };

  const switchLanguages = () => {
    const newLanguage = selectedLanguage === 'left' ? 'right' : 'left';
    setSelectedLanguage(newLanguage);

    // Intercambiar los textos si hay contenido
    if (inputText || outputText) {
      const tempText = inputText;
      setInputText(outputText.split('\n')[0]); // Solo tomar la primera línea de la traducción
      setOutputText('');
    }
  };

  return {
    inputText,
    outputText,
    isTranslating,
    selectedLanguage,
    setInputText,
    setOutputText,
    setSelectedLanguage,
    translate,
    clearTexts,
    clearInputText,
    switchLanguages,
  };
}
