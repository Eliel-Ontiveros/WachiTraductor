import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';


export function useClipboard() {
  const copyToClipboard = async (text: string, successMessage?: string) => {
    if (!text || text === 'Esperando.....') {
      return;
    }

    try {
      await Clipboard.setStringAsync(text);
      
    } catch (error) {
      console.error('Error al copiar:', error);
      Alert.alert('Error', 'No se pudo copiar el texto');
    }
  };

  const getFromClipboard = async (): Promise<string> => {
    try {
      const text = await Clipboard.getStringAsync();
      return text;
    } catch (error) {
      console.error('Error al leer portapapeles:', error);
      return '';
    }
  };

  return {
    copyToClipboard,
    getFromClipboard,
  };
}
