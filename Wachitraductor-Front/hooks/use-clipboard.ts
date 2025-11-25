import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

export const useClipboard = () => {
  const copyToClipboard = async (text: string) => {
    if (!text || text.trim() === '') {
      Alert.alert('Error', 'No hay texto para copiar');
      return;
    }

    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Éxito', 'Texto copiado al portapapeles');
    } catch (error) {
      console.error('Error al copiar:', error);
      Alert.alert('Error', 'No se pudo copiar el texto');
    }
  };

  const pasteFromClipboard = async (): Promise<string> => {
    try {
      const text = await Clipboard.getStringAsync();
      return text;
    } catch (error) {
      console.error('Error al pegar:', error);
      return '';
    }
  };

  return {
    copyToClipboard,
    pasteFromClipboard,
  };
};
